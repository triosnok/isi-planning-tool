package no.isi.insight.planning.repository;

import java.sql.Types;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.client.vehicle.view.VehicleDetails;
import no.isi.insight.planning.utility.JdbcUtils;

@Repository
@RequiredArgsConstructor
public class VehicleJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;

  // language=sql
  private static final String FIND_VEHICLE_QUERY = """
      WITH vehicle_reservations AS (
        SELECT
          pp.fk_vehicle_id,
          COUNT(*)
        FROM project_plan pp
        WHERE 1=1
          AND (CASE
            WHEN (:available_from_date IS NOT NULL AND :available_to_date IS NULL)
                THEN :available_from_date BETWEEN pp.starts_at AND pp.ends_at
            WHEN (:available_from_date IS NOT NULL AND :available_to_date IS NOT NULL)
                THEN pp.starts_at BETWEEN :available_from_date AND :available_to_date
                OR pp.ends_at BETWEEN :available_from_date AND :available_to_date
            ELSE NOW() BETWEEN pp.starts_at AND pp.ends_at
          END)
        GROUP BY pp.fk_vehicle_id
      )
      SELECT
        v.vehicle_id AS id,
        v.image_url as imageUrl,
        v.registration_number as registrationNumber,
        v.camera,
        v.description,
        v.gnss_id as gnssId,
        v.model,
        COALESCE(vr.count, 0) = 0 AS available,
        v.inactive_from as inactiveFrom
      FROM vehicle v
      LEFT JOIN vehicle_reservations vr
        ON v.vehicle_id = vr.fk_vehicle_id
      WHERE 1=1
        AND (:id IS NULL OR v.vehicle_id = :id::uuid)
      ORDER BY vr.count ASC NULLS FIRST
    """;

  private static final RowMapper<VehicleDetails> VEHICLE_DETAILS_ROW_MAPPER = (rs, rowNum) -> {
    return new VehicleDetails(
      UUID.fromString(rs.getString("id")),
      rs.getString("imageUrl"),
      rs.getString("registrationNumber"),
      rs.getString("model"),
      rs.getBoolean("camera"),
      rs.getString("description"),
      rs.getString("gnssId"),
      rs.getBoolean("available"),
      JdbcUtils.getNullableDate(rs, "inactiveFrom")
    );
  };

  public List<VehicleDetails> findVehicles(
      Optional<LocalDate> availableFrom,
      Optional<LocalDate> availableTo
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("available_from_date", availableFrom.orElse(null), Types.DATE);
    params.addValue("available_to_date", availableTo.orElse(null), Types.DATE);
    params.addValue("id", null, Types.VARCHAR);

    return this.jdbcTemplate.query(FIND_VEHICLE_QUERY, params, VEHICLE_DETAILS_ROW_MAPPER);
  }

  public Optional<VehicleDetails> findById(
      UUID id
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("id", id.toString(), Types.VARCHAR);
    params.addValue("available_from_date", null, Types.DATE);
    params.addValue("available_to_date", null, Types.DATE);

    var results = this.jdbcTemplate.query(FIND_VEHICLE_QUERY, params, VEHICLE_DETAILS_ROW_MAPPER);

    if (results.size() > 1) {
      throw new IllegalStateException("Multiple vehicles found for id: " + id);
    }

    return results.stream().findFirst();
  }
}
