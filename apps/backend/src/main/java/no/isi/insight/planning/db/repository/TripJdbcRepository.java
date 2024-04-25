package no.isi.insight.planning.db.repository;

import java.sql.Types;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.client.trip.view.TripDetails;

@Repository
@RequiredArgsConstructor
public class TripJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;

  // language=sql
  private static final String TRIP_DETAILS_QUERY = """
    SELECT
      t.trip_id AS id,
      pp.project_plan_id AS project_plan_id,
      p.project_id AS project_id,
      p.name AS project_name,
      d.full_name AS driver_full_name,
      t.started_at,
      t.ended_at,
      t.sequence_number,
      COALESCE(
          (SELECT COUNT(*) FROM trip_note tn WHERE tn.fk_trip_id = t.trip_id),
          0
      ) AS note_count,
      0 AS deviations
    FROM
      trip t
    INNER JOIN project_plan pp
      ON t.fk_project_plan_id = pp.project_plan_id
    INNER JOIN project p
      ON pp.fk_project_id = p.project_id
    INNER JOIN user_account d
      ON t.fk_driver_user_id = d.user_account_id
    INNER JOIN vehicle v
      ON t.fk_vehicle_id = v.vehicle_id
    WHERE (:projectId IS NULL OR p.project_id = :projectId::uuid)
      AND (:driverId IS NULL OR d.user_account_id = :driverId::uuid)
      AND (:vehicleId IS NULL OR v.vehicle_id = :vehicleId::uuid)
      AND (COALESCE(:planIds, NULL) IS NULL OR pp.project_plan_id::text IN (:planIds))
      AND (:active IS NULL OR (:active = FALSE AND t.ended_at IS NOT NULL) OR (:active = TRUE AND t.ended_at IS NULL))
    ORDER BY
        t.started_at DESC;
    """;

  private static final RowMapper<TripDetails> TRIP_DETAILS_ROW_MAPPER = (rs, i) -> {
    var id = rs.getString("id");

    if (rs.wasNull()) {
      return null;
    }

    return new TripDetails(
      UUID.fromString(id),
      UUID.fromString(rs.getString("project_plan_id")),
      UUID.fromString(rs.getString("project_id")),
      rs.getString("project_name"),
      rs.getString("driver_full_name"),
      rs.getTimestamp("started_at").toLocalDateTime(),
      rs.getTimestamp("ended_at") != null ? rs.getTimestamp("ended_at").toLocalDateTime() : null,
      rs.getInt("sequence_number"),
      rs.getLong("note_count"),
      rs.getInt("deviations")
    );
  };

  public List<TripDetails> findAllTrips(
      Optional<UUID> projectId,
      List<UUID> planIds,
      Optional<Boolean> active
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("projectId", projectId.orElse(null), Types.VARCHAR);
    params.addValue("planIds", planIds, Types.VARCHAR);
    params.addValue("active", active.orElse(null), Types.BOOLEAN);
    params.addValue("driverId", null, Types.VARCHAR);
    params.addValue("vehicleId", null, Types.VARCHAR);

    return jdbcTemplate.query(TRIP_DETAILS_QUERY, params, TRIP_DETAILS_ROW_MAPPER);
  }

  public List<TripDetails> findAllByVehicleId(
      UUID vehicleId
  ) {
    var params = new MapSqlParameterSource().addValue("projectId", null, Types.OTHER)
      .addValue("planIds", null, Types.ARRAY)
      .addValue("driverId", null, Types.OTHER)
      .addValue("vehicleId", vehicleId, Types.OTHER)
      .addValue("active", null, Types.BOOLEAN);

    return jdbcTemplate.query(TRIP_DETAILS_QUERY, params, TRIP_DETAILS_ROW_MAPPER);
  }

  public List<TripDetails> findAllByDriverId(
      UUID driverId,
      Optional<Boolean> active
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("projectId", null, Types.OTHER);
    params.addValue("planIds", null, Types.ARRAY);
    params.addValue("driverId", driverId, Types.OTHER);
    params.addValue("vehicleId", null, Types.OTHER);
    params.addValue("active", active.orElse(null), Types.BOOLEAN);

    return jdbcTemplate.query(TRIP_DETAILS_QUERY, params, TRIP_DETAILS_ROW_MAPPER);
  }
}
