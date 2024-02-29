package no.isi.insight.planning.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.vehicle.view.VehicleDetails;

@Repository
@RequiredArgsConstructor
public class VehicleJdbcRespotiory {
  private final NamedParameterJdbcTemplate jdbcTemplate;

  public List<VehicleDetails> findVehicles() {
    // language=sql
    var sql = """
      SELECT
        v.vehicle_id AS id,
        v.image_url as imageUrl,
        v.registration_number as registrationNumber,
        v.camera,
        v.description,
        v.gnss_id as gnssId,
        v.model
      FROM vehicle v
      """;

    return this.jdbcTemplate.query(
      sql,
      (rs, rowNum) -> new VehicleDetails(
        UUID.fromString(rs.getString("id")),
        rs.getString("imageUrl"),
        rs.getString("registrationNumber"),
        rs.getString("model"),
        rs.getBoolean("camera"),
        rs.getString("description"),
        rs.getString("gnssId")
      )
    );
  }
}
