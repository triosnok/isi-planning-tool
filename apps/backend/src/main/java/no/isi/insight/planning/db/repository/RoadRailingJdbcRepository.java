package no.isi.insight.planning.db.repository;

import java.sql.Types;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.client.geometry.Geometry;
import no.isi.insight.planning.client.railing.view.RailingRoadSegments;
import no.isi.insight.planning.client.railing.view.RoadRailing;
import no.isi.insight.planning.utility.JdbcUtils;

@Slf4j
@Repository
@RequiredArgsConstructor
public class RoadRailingJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;
  private final ObjectMapper objectMapper;

  /**
   * Finds all stored railings for a project, with optional scoping by plan or trip.
   * 
   * @param railingId     the railing id
   * @param projectId     the project id
   * @param planId        the plan id (optional)
   * @param tripId        the trip id (optional)
   * @param hideCompleted whether to hide railings that are considered fully captured
   * 
   * @return a list of railings
   */
  public List<RoadRailing> findAll(
      Optional<Long> railingId,
      Optional<UUID> projectId,
      List<UUID> planIds,
      Optional<UUID> tripId,
      boolean hideCompleted
  ) {
    // language=sql
    var sql = """
        WITH capture_aggregate AS (
          SELECT
            trc.fk_road_railing_id,
            trc.fk_road_segment_id,
            RANGE_AGG(trc.segment_coverage) AS captured
          FROM trip_railing_capture trc
          INNER JOIN trip t
            ON trc.fk_trip_id = t.trip_id
          INNER JOIN project_plan pp
            ON t.fk_project_plan_id = pp.project_plan_id
          WHERE 1=1
            -- only include captures when a project is specified
            AND (:projectId IS NOT NULL)
            AND (pp.fk_project_id = :projectId::uuid)
            AND (COALESCE(:planIds, NULL) IS NULL OR pp.project_plan_id::text IN (:planIds))
            AND (:tripId IS NULL OR trc.fk_trip_id = :tripId::uuid)
          GROUP BY trc.fk_road_railing_id, trc.fk_road_segment_id
        ),
        segment_coverage AS (
          SELECT
            ca.fk_road_railing_id,
            ca.fk_road_segment_id,
            SUM(UPPER(ca.captured) - LOWER(ca.captured)) AS coverage
          FROM capture_aggregate ca
          GROUP BY ca.fk_road_railing_id, ca.fk_road_segment_id
        ),
        segment_aggregate AS (
          SELECT
            rs.fk_road_railing_id,
            SUM(rs.length) AS total_length,
            SUM(sc.coverage) AS captured_length,
            SUM(sc.coverage) / SUM(rs.length) AS capture_fraction,
            JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'reference', rs.road_reference,
              'category', rs.road_category
            )) AS segments
          FROM road_segment rs
          LEFT JOIN segment_coverage sc
            ON rs.road_segment_id = sc.fk_road_segment_id
            AND rs.fk_road_railing_id = sc.fk_road_railing_id
          GROUP BY rs.fk_road_railing_id
        ),
        last_capture AS (
          SELECT
            trc.fk_road_railing_id,
            MAX(trc.captured_at) AS captured_at
          FROM trip_railing_capture trc
          INNER JOIN trip t
            ON trc.fk_trip_id = t.trip_id
          INNER JOIN project_plan pp
            ON t.fk_project_plan_id = pp.project_plan_id
          WHERE 1=1
            AND (:projectId IS NULL OR pp.fk_project_id = :projectId::uuid)
          GROUP BY trc.fk_road_railing_id
        )
        SELECT
          rr.road_railing_id,
          rr.length,
          lc.captured_at,
          ST_AsText(ST_Force2D(rr.geometry)) AS wkt,
          ST_SRID(rr.geometry) AS srid,
          sa.captured_length,
          sa.total_length,
          sa.segments,
          sa.capture_fraction AS capture_grade
        FROM road_railing rr
        LEFT JOIN project_plan_road_railing pprr
          ON rr.road_railing_id = pprr.fk_road_railing_id
          -- only consider plans whenever a project is defined, not for a single railing
          AND :railingId IS NULL OR :projectId IS NOT NULL
        LEFT JOIN project_plan pp
          ON pprr.fk_project_plan_id = pp.project_plan_id
        LEFT JOIN segment_aggregate sa
          ON rr.road_railing_id = sa.fk_road_railing_id
        LEFT JOIN last_capture lc
          ON rr.road_railing_id = lc.fk_road_railing_id
        WHERE 1=1
          AND (:railingId IS NULL OR rr.road_railing_id = :railingId)
          AND (:projectId IS NULL OR pp.fk_project_id = :projectId::uuid)
          AND (COALESCE(:planIds, NULL) IS NULL OR pp.project_plan_id::text IN (:planIds))
          AND (:hideCompleted = FALSE OR COALESCE(sa.capture_fraction, 0) < 0.95)
      """;

    var params = new MapSqlParameterSource().addValue("railingId", railingId.orElse(null), Types.BIGINT)
      .addValue("projectId", projectId.orElse(null), Types.VARCHAR)
      .addValue("planIds", planIds, Types.VARCHAR)
      .addValue("tripId", tripId.orElse(null), Types.VARCHAR)
      .addValue("hideCompleted", hideCompleted, Types.BOOLEAN);

    return this.jdbcTemplate.query(sql, params, (rs, i) -> {
      var id = rs.getLong("road_railing_id");
      List<RailingRoadSegments> segments = List.of();

      try {
        segments = Arrays.asList(this.objectMapper.readValue(rs.getBytes("segments"), RailingRoadSegments[].class));
      } catch (Exception e) {
        log.error("Failed to map segments for road railing with id={}, {}", id, e.getMessage());
      }

      return new RoadRailing(
        id,
        new Geometry(
          rs.getString("wkt"),
          rs.getInt("srid")
        ),
        rs.getDouble("length"),
        rs.getDouble("capture_grade"),
        JdbcUtils.getNullableDateTime(rs, "captured_at"),
        segments
      );
    });
  }

  public List<RoadRailing> findAll(
      Optional<UUID> projectId,
      List<UUID> planIds,
      Optional<UUID> tripId,
      boolean hideCompleted
  ) {
    return this.findAll(Optional.empty(), projectId, planIds, tripId, hideCompleted);
  }

  public Optional<RoadRailing> findById(
      Long id,
      Optional<UUID> projectId
  ) {
    var railings = this.findAll(Optional.of(id), projectId, null, Optional.empty(), false);

    if (railings.size() > 1) {
      throw new IllegalStateException("");
    }

    return railings.stream().findFirst();
  }

}
