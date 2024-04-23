package no.isi.insight.planning.db.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import java.sql.Types;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.client.geometry.Geometry;
import no.isi.insight.planning.client.project.view.RoadRailing;
import no.isi.insight.planning.utility.JdbcUtils;

@Repository
@RequiredArgsConstructor
public class RoadRailingJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;

  /**
   * Finds all stored railings for a project, with optional scoping by plan or trip.
   * 
   * @param projectId     the project id
   * @param planId        the plan id (optional)
   * @param tripId        the trip id (optional)
   * @param hideCompleted whether to hide railings that are considered fully captured
   * 
   * @return a list of railings
   */
  public List<RoadRailing> getRailings(
      UUID projectId,
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
            AND (pp.fk_project_id = :projectId)
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
            JSON_AGG(JSON_BUILD_OBJECT(
              'reference', rs.road_reference,
              'category', rs.road_category,
              'length', rs.length
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
          sa.capture_fraction * 100 AS capture_grade
        FROM road_railing rr
        LEFT JOIN project_plan_road_railing pprr
          ON rr.road_railing_id = pprr.fk_road_railing_id
        LEFT JOIN project_plan pp
          ON pprr.fk_project_plan_id = pp.project_plan_id
        LEFT JOIN segment_aggregate sa
          ON rr.road_railing_id = sa.fk_road_railing_id
        LEFT JOIN last_capture lc
          ON rr.road_railing_id = lc.fk_road_railing_id
        WHERE 1=1
          AND (pp.fk_project_id = :projectId)
          AND (COALESCE(:planIds, NULL) IS NULL OR pp.project_plan_id::text IN (:planIds))
          AND (:hideCompleted = FALSE OR COALESCE(sa.capture_fraction, 0) < 0.95)
      """;

    var params = new MapSqlParameterSource();

    params.addValue("projectId", projectId);
    params.addValue("planIds", planIds, Types.VARCHAR);
    params.addValue("tripId", tripId.orElse(null), Types.VARCHAR);
    params.addValue("hideCompleted", hideCompleted, Types.BOOLEAN);

    return this.jdbcTemplate.query(
      sql,
      params,
      (rs, i) -> new RoadRailing(
        rs.getLong("road_railing_id"),
        new Geometry(
          rs.getString("wkt"),
          rs.getInt("srid")
        ),
        rs.getDouble("length"),
        rs.getDouble("capture_grade"),
        JdbcUtils.getNullableDate(rs, "captured_at")
      )
    );
  }

}
