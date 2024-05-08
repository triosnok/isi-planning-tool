package no.isi.insight.planning.db.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.client.project.view.ProjectPlanDetails;
import no.isi.insight.planning.client.project.view.RailingImportDetails;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ProjectPlanJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;
  private final ObjectMapper objectMapper;

  // language=sql
  private static final String PLAN_DETAILS_QUERY = """
      WITH railing_aggregate AS (
        SELECT
          pprr.fk_project_plan_id,
          COUNT(DISTINCT rr.road_railing_id) AS railing_count,
          SUM(rs.length) AS sum_meters,
          JSON_AGG(DISTINCT rs.road_reference) AS segments
        FROM project_plan_road_railing pprr
        LEFT JOIN road_railing rr
          ON pprr.fk_road_railing_id = rr.road_railing_id
        LEFT JOIN road_segment rs
          ON rr.road_railing_id = rs.fk_road_railing_id
        GROUP BY pprr.fk_project_plan_id
      ),
      trip_aggregate AS (
        SELECT
          t.fk_project_plan_id,
          COUNT(*) AS active_trips
        FROM trip t
        WHERE t.ended_at IS NULL
        GROUP BY t.fk_project_plan_id
      )
      SELECT
        pp.project_plan_id,
        pp.fk_project_id,
        p.name AS project_name,
        pp.starts_at,
        pp.ends_at,
        pp.railing_imports,
        pp.fk_vehicle_id,
        v.model,
        v.registration_number,
        ta.active_trips,
        ra.railing_count,
        ra.sum_meters,
        COALESCE(ra.segments, '[]'::json) AS segments
      FROM project_plan pp
      LEFT JOIN vehicle v
        ON pp.fk_vehicle_id = v.vehicle_id
      LEFT JOIN railing_aggregate ra
        ON pp.project_plan_id = ra.fk_project_plan_id
      LEFT JOIN trip_aggregate ta
        ON pp.project_plan_id = ta.fk_project_plan_id
      LEFT JOIN project p
        ON pp.fk_project_id = p.project_id
      WHERE 1=1
        AND (:id IS NULL OR pp.project_plan_id = :id::uuid)
        AND (:projectId IS NULL OR pp.fk_project_id = :projectId::uuid)
        AND (:vehicleId IS NULL OR pp.fk_vehicle_id = :vehicleId::uuid)
      ORDER BY pp.starts_at ASC
    """;

  private ProjectPlanDetails mapPlanDetailsRow(
      ResultSet rs,
      int index
  ) throws SQLException {
    var id = rs.getObject("project_plan_id", UUID.class);

    if (rs.wasNull()) {
      return null;
    }

    List<RailingImportDetails> imports = List.of();

    try {
      imports = Arrays
        .asList(this.objectMapper.readValue(rs.getBytes("railing_imports"), RailingImportDetails[].class));
      imports.sort(Comparator.comparing(RailingImportDetails::importedAt).reversed());
    } catch (Exception e) {
      log.warn("Failed to parse railing imports JSON column: {}", e.getMessage());
    }

    List<String> segments = List.of();

    try {
      segments = Arrays.asList(this.objectMapper.readValue(rs.getBytes("segments"), String[].class));
    } catch (Exception e) {
      log.warn("Failed to map segments for road railing with id={}, {}", id, e.getMessage());
    }

    return ProjectPlanDetails.builder()
      .id(id)
      .projectId(rs.getObject("fk_project_id", UUID.class))
      .projectName(rs.getString("project_name"))
      .startsAt(rs.getDate("starts_at").toLocalDate())
      .endsAt(rs.getDate("ends_at").toLocalDate())
      .vehicleModel(rs.getString("model"))
      .registrationNumber(rs.getString("registration_number"))
      .activeTrips(rs.getInt("active_trips"))
      .railings(rs.getInt("railing_count"))
      .vehicleId(rs.getObject("fk_vehicle_id", UUID.class))
      .imports(imports)
      .segments(segments)
      .meters(rs.getDouble("sum_meters"))
      .build();
  };

  public Optional<ProjectPlanDetails> findById(
      UUID id
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("id", id, Types.VARCHAR);
    params.addValue("projectId", null, Types.VARCHAR);
    params.addValue("vehicleId", null, Types.VARCHAR);

    return Optional.ofNullable(this.jdbcTemplate.queryForObject(PLAN_DETAILS_QUERY, params, this::mapPlanDetailsRow));
  }

  public List<ProjectPlanDetails> findByProjectId(
      UUID projectId
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("id", null, Types.VARCHAR);
    params.addValue("projectId", projectId, Types.VARCHAR);
    params.addValue("vehicleId", null, Types.VARCHAR);

    return this.jdbcTemplate.query(PLAN_DETAILS_QUERY, params, this::mapPlanDetailsRow);
  }

  public List<ProjectPlanDetails> findByVehicleId(
      UUID vehicleId
  ) {
    var params = new MapSqlParameterSource();

    params.addValue("id", null, Types.VARCHAR);
    params.addValue("projectId", null, Types.VARCHAR);
    params.addValue("vehicleId", vehicleId, Types.VARCHAR);

    return this.jdbcTemplate.query(PLAN_DETAILS_QUERY, params, this::mapPlanDetailsRow);
  }
}
