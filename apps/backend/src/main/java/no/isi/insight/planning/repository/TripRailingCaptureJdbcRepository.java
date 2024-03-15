package no.isi.insight.planning.repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.capture.config.CaptureProcessingConfig;
import no.isi.insight.planning.capture.model.ProcessedLogEntry;
import no.isi.insight.planning.geometry.GeometryProperties;

@Slf4j
@Repository
@RequiredArgsConstructor
public class TripRailingCaptureJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;
  private final CaptureProcessingConfig captureConfig;
  private final GeometryProperties geometryProperties;
  private final ObjectMapper objectMapper;

  /**
   * Saves trip railing capture data from processed log entires. Also matches the capture data to
   * railings in the project plan the trip was made in.
   * 
   * @param tripId  the id of the trip to save railing capture data for
   * @param entries the processed log entries to save
   */
  @Transactional(readOnly = false)
  public void saveRailingCapture(
      UUID tripId,
      List<ProcessedLogEntry> entries
  ) {
    // language=sql
    final var createTempTableQuery = """
        CREATE TEMPORARY TABLE temp_trip_railing_capture_log (
          position GEOMETRY(POINT, :targetSrid),
          timestamp TIMESTAMP,
          images JSON
        );
      """;

    this.jdbcTemplate.update(createTempTableQuery, Map.of("targetSrid", this.geometryProperties.getSRID()));

    // language=sql
    final var insertTempTableQuery = """
        INSERT INTO temp_trip_railing_capture_log (position, timestamp, images)
        VALUES (ST_Transform(ST_PointFromText(:position, :referenceSrid), :targetSrid), :timestamp, :images::json)
      """;

    var tempInsertionParams = entries.stream().map(entry -> {
      var params = new MapSqlParameterSource();
      String imagesJson = null;

      try {
        imagesJson = this.objectMapper.writeValueAsString(entry.images());

      } catch (Exception e) {
        log.error("Failed to serialize images", e);
      }

      params.addValue("position", entry.point().toText());
      params.addValue("timestamp", entry.timestamp());
      params.addValue("images", imagesJson);
      params.addValue("referenceSrid", this.captureConfig.getSRID());
      params.addValue("targetSrid", this.geometryProperties.getSRID());

      return params;
    }).toArray(MapSqlParameterSource[]::new);

    this.jdbcTemplate.batchUpdate(insertTempTableQuery, tempInsertionParams);

    // language=sql
    final var insertRailingsQuery = """
      INSERT INTO trip_railing_capture (fk_trip_id, fk_road_railing_id, captured_at, position, image_urls)
      SELECT
        t.trip_id,
        rr.road_railing_id,
        ttrl.timestamp,
        ttrl.position,
        ttrl.images
      FROM trip t
      INNER JOIN project_plan pp
        ON t.fk_project_plan_id = pp.project_plan_id
      INNER JOIN project_plan_road_railing pprr
        ON pp.project_plan_id = pprr.fk_project_plan_id
      INNER JOIN road_railing rr
        ON pprr.fk_road_railing_id = rr.road_railing_id
      INNER JOIN temp_trip_railing_capture_log ttrl
        ON ST_DWithin(ttrl.position, rr.geometry, 0.5)
      WHERE t.trip_id = :tripId
      """;

    this.jdbcTemplate.update(insertRailingsQuery, Map.of("tripId", tripId));
  }

  @Transactional(readOnly = false)
  int deleteByTripId(
      UUID tripId
  ) {
    // language=sql
    final var deleteQuery = """
        DELETE FROM trip_railing_capture WHERE fk_trip_id = :tripId
      """;

    return this.jdbcTemplate.update(deleteQuery, Map.of("tripId", tripId));
  }

}
