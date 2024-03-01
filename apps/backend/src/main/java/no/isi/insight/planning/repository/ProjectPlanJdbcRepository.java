package no.isi.insight.planning.repository;

import java.sql.Types;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.project.view.ProjectPlanDetails;

@Repository
@RequiredArgsConstructor
public class ProjectPlanJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;

  // language=sql
  private static final String PLAN_DETAILS_QUERY = """
      WITH railing_aggregate AS (
        SELECT
          pprr.fk_project_plan_id,
          COUNT(*) AS railing_count,
          SUM(rr.length) AS sum_meters
        FROM project_plan_road_railing pprr
        LEFT JOIN road_railing rr
          ON pprr.fk_road_railing_id = rr.road_railing_id
        GROUP BY pprr.fk_project_plan_id
      )
      SELECT
        pp.project_plan_id,
        pp.starts_at,
        pp.ends_at,
        v.model,
        v.registration_number,
        0 AS active_trips,
        ra.railing_count,
        ra.sum_meters
      FROM project_plan pp
      LEFT JOIN vehicle v
        ON pp.fk_vehicle_id = v.vehicle_id
      LEFT JOIN railing_aggregate ra
        ON pp.project_plan_id = ra.fk_project_plan_id
      WHERE 1=1
        AND (:id IS NULL OR pp.project_plan_id = :id::uuid)
        AND (:projectId IS NULL OR pp.fk_project_id = :projectId::uuid)
    """;

  private static final RowMapper<ProjectPlanDetails> PLAN_DETAILS_MAPPER = (rs, i) -> {
    var id = rs.getString("project_plan_id");

    if (rs.wasNull()) {
      return null;
    }

    return ProjectPlanDetails.builder()
      .id(UUID.fromString(id))
      .startsAt(rs.getDate("starts_at").toLocalDate())
      .endsAt(rs.getDate("ends_at").toLocalDate())
      .vehicleModel(rs.getString("model"))
      .registrationNumber(rs.getString("registration_number"))
      .activeTrips(rs.getInt("active_trips"))
      .railings(rs.getInt("railing_count"))
      .meters(rs.getDouble("sum_meters"))
      .build();
  };

  public Optional<ProjectPlanDetails> findPlanByIds(
      UUID id,
      UUID projectId
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("id", id, Types.VARCHAR);
    params.addValue("projectId", projectId, Types.VARCHAR);

    return Optional.ofNullable(this.jdbcTemplate.queryForObject(PLAN_DETAILS_QUERY, params, PLAN_DETAILS_MAPPER));
  }

  public Optional<ProjectPlanDetails> findPlanDetailsById(
      UUID id
  ) {
    return this.findPlanByIds(id, null);
  }

  public List<ProjectPlanDetails> findPlanDetailsByProjectId(
      UUID projectId
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("id", null, Types.VARCHAR);
    params.addValue("projectId", projectId, Types.VARCHAR);

    return this.jdbcTemplate.query(PLAN_DETAILS_QUERY, PLAN_DETAILS_MAPPER);
  }

}
