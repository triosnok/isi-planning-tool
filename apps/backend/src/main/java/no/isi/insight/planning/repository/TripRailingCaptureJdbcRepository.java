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
          position GEOMETRY(POINT, $targetSrid),
          heading NUMERIC,
          timestamp TIMESTAMP,
          images JSON
        );
      """.replace("$targetSrid", this.geometryProperties.getSRID().toString());

    this.jdbcTemplate.update(createTempTableQuery, Map.of());

    // language=sql
    final var insertTempTableQuery = """
        INSERT INTO temp_trip_railing_capture_log (position, heading, timestamp, images)
        VALUES (ST_Transform(ST_PointFromText(:position, :referenceSrid), :targetSrid), :heading, :timestamp, :images::json)
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
      params.addValue("heading", entry.heading());
      params.addValue("images", imagesJson);
      params.addValue("referenceSrid", this.captureConfig.getSRID());
      params.addValue("targetSrid", this.geometryProperties.getSRID());

      return params;
    }).toArray(MapSqlParameterSource[]::new);

    this.jdbcTemplate.batchUpdate(insertTempTableQuery, tempInsertionParams);

    // language=sql
    final var insertRailingsQuery = """
      WITH base_candidate AS (
	      SELECT
          rr.road_railing_id,
          rs.road_segment_id,
          rrrs.direction_of_road,
          rrrs.side_of_road,
          ST_ClosestPoint(ttrl.position, rs.geometry) AS road_closest,
          ST_Force2D(rs.geometry) AS road_geometry,
          ttrl.timestamp,
          ttrl.position,
          ttrl.images,
          ttrl.heading,
          ROW_NUMBER() OVER(PARTITION BY ttrl.timestamp ORDER BY ttrl.POSITION <-> rs.geometry) AS distance_rank
        FROM temp_trip_railing_capture_log ttrl
        INNER JOIN road_railing rr
          ON ST_DWithin(ttrl.POSITION, rr.geometry, 3)
        INNER JOIN road_railing_road_segment rrrs
          ON rr.road_railing_id = rrrs.fk_road_railing_id
        INNER JOIN road_segment rs
          ON rrrs.fk_road_segment_id = rs.road_segment_id
      ),
      projected_candidate AS (
        SELECT 
          bc.road_railing_id,
          bc.road_segment_id,
          bc.direction_of_road,
          bc.side_of_road,
          bc.timestamp,
          bc.position,
          bc.images,
          DEGREES(ST_Angle(
            ST_MakeLine(bc.position, ST_Project(bc.position, 1, RADIANS(bc.heading))),
            ST_MakeLine(
              ST_LineInterpolatePoint(bc.road_geometry, GREATEST(0, ST_LineLocatePoint(bc.road_geometry, bc.road_closest) - 0.01)),
              ST_LineInterpolatePoint(bc.road_geometry, LEAST(1, ST_LineLocatePoint(bc.road_geometry, bc.road_closest) + 0.01))
            )
          )) AS angle
        FROM base_candidate bc
        WHERE bc.distance_rank = 1
      ),
      candidate AS (
        SELECT 
          *,
          (CASE 
            WHEN pc.angle BETWEEN 90 AND 270 THEN 'WITH'
            ELSE 'AGAINST'
          END)::road_direction AS inferred_driving_direction
        FROM projected_candidate pc
      )
      INSERT INTO trip_railing_capture (fk_trip_id, fk_road_railing_id, captured_at, position, image_urls)
      SELECT
        t.trip_id,
        c.road_railing_id,
        c.timestamp,
        c.position,
        c.images
      FROM trip t
      INNER JOIN project_plan pp
        ON t.fk_project_plan_id = pp.project_plan_id
      INNER JOIN project_plan_road_railing pprr
        ON pp.project_plan_id = pprr.fk_project_plan_id
      INNER JOIN candidate c
        ON pprr.fk_road_railing_id = c.road_railing_id
      WHERE 1=1
        AND (t.trip_id = :tripId)
        AND (c.direction_of_road = c.inferred_driving_direction)
        AND (CASE
          WHEN c.side_of_road = 'LEFT' THEN c.images->>'LEFT' IS NOT NULL
          WHEN c.side_of_road = 'RIGHT' THEN c.images->>'RIGHT' IS NOT NULL
          WHEN c.side_of_road = 'LEFT_AND_RIGHT' THEN c.images->>'LEFT' IS NOT NULL OR c.images->>'RIGHT' IS NOT NULL
          ELSE FALSE
        END)
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
