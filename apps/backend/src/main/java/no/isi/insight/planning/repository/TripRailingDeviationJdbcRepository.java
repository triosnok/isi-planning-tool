package no.isi.insight.planning.repository;

import java.sql.Types;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.client.deviation.view.DeviationDetails;
import no.isi.insight.planning.client.geometry.Geometry;

@Slf4j
@Repository
@RequiredArgsConstructor
public class TripRailingDeviationJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;
  private final ObjectMapper objectMapper;

  // language=sql
  private static final String FIND_DEVIATIONS_QUERY = """
      SELECT
        rs.road_system_reference,
        trc.fk_road_railing_id AS railing_id,
        ST_AsText(trc.position) AS pos_wkt,
        ST_SRID(trc.position) AS pos_srid,
        trd.deviation_type
      FROM trip_railing_deviation trd
      INNER JOIN trip_railing_capture trc
        ON trd.fk_trip_railing_capture_id = trc.trip_railing_capture_id
      INNER JOIN trip t
        ON trc.fk_trip_id = t.trip_id
      INNER JOIN project_plan pp
        ON t.fk_project_plan_id = pp.project_plan_id
      INNER JOIN project p
        ON pp.fk_project_id = p.project_id
      LEFT JOIN road_segment rs
        ON trc.fk_road_segment_id = rs.road_segment_id
        AND trc.fk_road_railing_id = rs.fk_road_railing_id
      WHERE 1=1
        AND (:deviationId IS NULL OR trd.trip_railing_deviation_id = :deviationId::uuid)
        AND (:projectId IS NULL OR p.project_id = :projectId::uuid)
        AND (:planId IS NULL OR pp.project_plan_id = :planId::uuid)
        AND (:tripId IS NULL OR t.trip_id = :tripId::uuid)
        AND (:railingId IS NULL OR rs.fk_road_railing_id = :railingId)
    """;

  private static final TypeReference<Map<String, String>> STRING_MAP_TYPE = new TypeReference<>(){};

  public List<DeviationDetails> findDeviations(
      Optional<UUID> deviationId,
      Optional<UUID> projectId,
      Optional<UUID> planId,
      Optional<UUID> tripId,
      Optional<Long> railingId
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("deviationId", deviationId.orElse(null), Types.VARCHAR);
    params.addValue("projectId", projectId.orElse(null), Types.VARCHAR);
    params.addValue("planId", planId.orElse(null), Types.VARCHAR);
    params.addValue("tripId", tripId.orElse(null), Types.VARCHAR);
    params.addValue("railingId", railingId.orElse(null), Types.BIGINT);

    return this.jdbcTemplate.query(FIND_DEVIATIONS_QUERY, params, (rs, i) -> {
      Map<String, String> details = Map.of();

      try {
        details = this.objectMapper.readValue(rs.getBytes("details"), STRING_MAP_TYPE);
      } catch (Exception e) {
        log.error("Failed to parse deviation details");
      }

      return new DeviationDetails(
        rs.getString("road_system_reference"),
        rs.getLong("railing_id"),
        new Geometry(
          rs.getString("pos_wkt"),
          rs.getInt("pos_srid")
        ),
        rs.getString("deviation_type"),
        details
      );
    });
  }

  public Optional<DeviationDetails> findById(
      UUID id
  ) {
    var deviations = this
      .findDeviations(Optional.of(id), Optional.empty(), Optional.empty(), Optional.empty(), Optional.empty());

    if (deviations.size() > 1) {
      throw new IllegalStateException("Found more than one deviation by id");
    }

    return deviations.stream().findFirst();
  }

}
