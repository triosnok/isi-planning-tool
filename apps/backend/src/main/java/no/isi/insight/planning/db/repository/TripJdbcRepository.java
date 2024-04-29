package no.isi.insight.planning.db.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.client.capture.view.CaptureDetails;
import no.isi.insight.planning.client.trip.view.TripDetails;

@Slf4j
@Repository
@RequiredArgsConstructor
public class TripJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;
  private final ObjectMapper objectMapper;

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
      0 AS deviations,
      t.capture_details
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

  private TripDetails mapTripDetailsPlan(
      ResultSet rs,
      int index
  ) throws SQLException {
    var id = rs.getString("id");

    if (rs.wasNull()) {
      return null;
    }

    CaptureDetails captureDetails = null;

    
    try {
      captureDetails = this.objectMapper.readValue(rs.getBytes("capture_details"), CaptureDetails.class);
    } catch (Exception e) {
      log.warn("Error parsing capture details JSON: {}", e.getMessage());
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
      rs.getInt("deviations"),
      captureDetails
    );
  };

  public List<TripDetails> findAll(
      Optional<UUID> projectId,
      List<UUID> planIds,
      Optional<UUID> driverId,
      Optional<UUID> vehicleId,
      Optional<Boolean> active
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("projectId", projectId.orElse(null), Types.VARCHAR);
    params.addValue("planIds", planIds, Types.VARCHAR);
    params.addValue("active", active.orElse(null), Types.BOOLEAN);
    params.addValue("driverId", driverId.orElse(null), Types.VARCHAR);
    params.addValue("vehicleId", vehicleId.orElse(null), Types.VARCHAR);

    return jdbcTemplate.query(TRIP_DETAILS_QUERY, params, this::mapTripDetailsPlan);
  }

  public List<TripDetails> findAll(
      Optional<UUID> projectId,
      List<UUID> planIds,
      Optional<Boolean> active
  ) {
    return this.findAll(projectId, planIds, Optional.empty(), Optional.empty(), active);
  }

  public List<TripDetails> findAll(
      UUID vehicleId
  ) {
    return this.findAll(Optional.empty(), null, Optional.empty(), Optional.of(vehicleId), Optional.empty());
  }

  public List<TripDetails> findAll(
      UUID driverId,
      Optional<Boolean> active
  ) {
    return this.findAll(Optional.empty(), null, Optional.of(driverId), Optional.empty(), active);
  }
}
