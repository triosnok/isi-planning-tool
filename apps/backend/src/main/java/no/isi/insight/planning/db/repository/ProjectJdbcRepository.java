package no.isi.insight.planning.db.repository;

import java.sql.Types;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.client.project.view.ProjectDetails;
import no.isi.insight.planning.client.project.view.ProjectStatus;
import no.isi.insight.planning.utility.JdbcUtils;

@Repository
@RequiredArgsConstructor
public class ProjectJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;

  // language=sql
  private static final String PROJECT_DETAILS_QUERY = """
      WITH trip_aggregate AS (
        SELECT
          NULL::uuid AS fk_project_plan_id,
          0 AS active_trips,
          0 AS notes,
          0 AS deviations
      ),
      plan_aggregate AS (
        SELECT
          pp.fk_project_id,
          SUM(0) AS captured_length,
          SUM(rr.length) AS total_length,
          SUM(ta.active_trips) AS active_trips,
          SUM(ta.notes) AS notes,
          SUM(ta.deviations) AS deviations
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
        COALESCE(pa.captured_length, 0) AS captured_length,
        COALESCE(pa.total_length, 0) AS total_length,
        COALESCE(pa.active_trips, 0) AS active_trips,
        COALESCE(pa.notes, 0) AS notes,
        COALESCE(pa.deviations, 0) AS deviations
      FROM project p
      LEFT JOIN plan_aggregate pa
        ON p.project_id = pa.fk_project_id
      WHERE 1=1
        AND (:projectId IS NULL OR p.project_id = :projectId::uuid)
        AND (:projectStatus IS NULL OR CASE
            WHEN :projectStatus = 'ONGOING' THEN (NOW() >= p.starts_at AND NOW() <= COALESCE(p.ends_at, NOW()))
            WHEN :projectStatus = 'UPCOMING' THEN NOW() < p.starts_at
            WHEN :projectStatus = 'PREVIOUS' THEN NOW() > p.ends_at
          END)
      ORDER BY
        CASE
          WHEN :projectStatus = 'ONGOING' THEN p.starts_at
          WHEN :projectStatus = 'UPCOMING' THEN p.starts_at
        END ASC,
        CASE WHEN :projectStatus = 'PREVIOUS' THEN p.ends_at END DESC
    """;

  private static final RowMapper<ProjectDetails> PROJECT_DETAILS_ROW_MAPPER = (rs, i) -> {
    var id = rs.getString("id");

    if (rs.wasNull()) {
      return null;
    }

    return new ProjectDetails(
      UUID.fromString(id),
      rs.getString("name"),
      rs.getString("reference_code"),
      JdbcUtils.getNullableDate(rs, "starts_at"),
      JdbcUtils.getNullableDate(rs, "ends_at"),
      rs.getDouble("captured_length"),
      rs.getDouble("total_length"),
      rs.getInt("deviations"),
      rs.getInt("notes")
    );
  };

  public List<ProjectDetails> findProjects(
      Optional<ProjectStatus> status
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("projectId", null, Types.VARCHAR);
    params.addValue("projectStatus", status.map(ProjectStatus::name).orElse(null), Types.VARCHAR);

    return this.jdbcTemplate.query(PROJECT_DETAILS_QUERY, params, PROJECT_DETAILS_ROW_MAPPER);
  }

  public Optional<ProjectDetails> findById(
      UUID projectId
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("projectId", projectId, Types.VARCHAR);
    params.addValue("projectStatus", null, Types.VARCHAR);

    return this.jdbcTemplate.query(PROJECT_DETAILS_QUERY, params, PROJECT_DETAILS_ROW_MAPPER).stream().findFirst();
  }
}
