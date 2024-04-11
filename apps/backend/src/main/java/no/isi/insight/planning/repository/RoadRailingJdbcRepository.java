package no.isi.insight.planning.repository;

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
        WITH trip_railings AS (
          SELECT
            trc.fk_trip_id,
            trc.fk_road_railing_id,
            COUNT(*) AS captured_length
          FROM trip_railing_capture trc
          INNER JOIN trip t
            ON trc.fk_trip_id = t.trip_id
          INNER JOIN project_plan pp
            ON t.fk_project_plan_id = pp.project_plan_id
          WHERE pp.fk_project_id = :projectId
          GROUP BY trc.fk_road_railing_id, trc.fk_trip_id, t.fk_project_plan_id, pp.fk_project_id
        )
        SELECT
          ST_AsText(ST_Force2D(rr.geometry)) AS wkt,
          ST_SRID(rr.geometry) AS srid,
          (trc.captured_length / CEIL(rr.length)) * 100 AS capture_grade
        FROM road_railing rr
        LEFT JOIN project_plan_road_railing pprr
          ON rr.road_railing_id = pprr.fk_road_railing_id
        LEFT JOIN project_plan pp
          ON pprr.fk_project_plan_id = pp.project_plan_id
        LEFT JOIN project p
          ON pp.fk_project_id = p.project_id
        LEFT JOIN trip_railings trc
          ON rr.road_railing_id = trc.fk_road_railing_id
        WHERE 1=1
          AND (p.project_id = :projectId)
          AND (COALESCE(:planIds, NULL) IS NULL OR pp.project_plan_id::text IN (:planIds))
          AND (:tripId IS NULL OR trc.fk_trip_id = :tripId::uuid)
          AND (:hideCompleted = FALSE OR COALESCE(trc.captured_length, 0) < CEIL(rr.length))
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
        new Geometry(
          rs.getString("wkt"),
          rs.getInt("srid")
        ),
        rs.getDouble("capture_grade")
      )
    );
  }

}
