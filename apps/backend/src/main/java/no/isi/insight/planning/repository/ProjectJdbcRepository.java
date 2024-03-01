package no.isi.insight.planning.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.project.view.ProjectDetails;
import no.isi.insight.planning.utility.JdbcUtils;

@Repository
@RequiredArgsConstructor
public class ProjectJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;

  public List<ProjectDetails> findProjects() {
    // language=sql
    var sql = """
      WITH trip_aggregate AS (
        SELECT
          NULL AS fk_project_plan_id,
          0 AS active_trips
      ),
      plan_aggregate AS (
        SELECT
          pp.fk_project_id,
          SUM(0) AS captured_length,
          SUM(rr.length) AS total_length,
          SUM(ta.active_trips) AS active_trips,
        FROM project_plan pp
        LEFT JOIN trip_aggregate ta
          ON pp.project_plan_id = ta.fk_project_plan_id
        LEFT JOIN project_plan_road_railing pprr
          ON pp.project_plan_id = pprr.fk_project_plan_id
        LEFT JOIN vehicle v
          ON pp.fk_vehicle_id = v.vehicle_id
        LEFT JOIN road_railing rr
          ON pprr.fk_road_railing_id = rr.road_railing_id
        GROUP BY pp.fk_project_id
      )
      SELECT
        p.project_id AS id,
        p.name,
        p.reference_code,
        p.starts_at,
        p.ends_at,
        COALESCE(JSON_AGG(pa.plans), '[]'::json) AS plans
      FROM project p
      LEFT JOIN plan_aggregate pa
        ON p.project_id = pa.fk_project_id
      """;

    return this.jdbcTemplate.query(
      sql,
      (rs, rowNum) -> new ProjectDetails(
        rs.getObject("id", UUID.class),
        rs.getString("name"),
        rs.getString("reference_code"),
        JdbcUtils.getNullableDate(rs, "starts_at"),
        JdbcUtils.getNullableDate(rs, "ends_at"),
        rs.getDouble("captured_length"),
        rs.getDouble("total_length"),
        rs.getInt("deviations"),
        rs.getInt("notes")
      )
    );
  }
}
