package no.isi.insight.planning.db.repository;

import java.util.List;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.client.search.view.SearchResult;

/**
 * Repository for searching across multiple entities.
 */
@Slf4j
@Repository
@RequiredArgsConstructor
public class SearchJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;
  private final ObjectMapper objectMapper;

  // we could introduce something like similarity matching using 'pg_trgm' here, but ILIKE is
  // sufficient for now
  // language=sql
  private static final String SEARCH_QUERY = """
    WITH project_search AS (
      SELECT
        p.name || ' ' || p.reference_code AS search_vector,
        JSON_BUILD_OBJECT(
          'type', 'PROJECT',
          'id', p.project_id,
          'name', p.name,
          'referenceCode', p.reference_code
        ) AS result
      FROM project p
    ),
    user_search AS (
      SELECT
        u.full_name || ' ' || u.email AS search_vector,
        JSON_BUILD_OBJECT(
          'type', 'USER',
          'id', u.user_account_id,
          'fullName', u.full_name,
          'email', u.email
        ) AS result
      FROM user_account u
    ),
    vehicle_search AS (
      SELECT
        v.model || ' ' || v.registration_number || ' ' || v.gnss_id AS search_vector,
        JSON_BUILD_OBJECT(
          'type', 'VEHICLE',
          'id', v.vehicle_id,
          'model', v.model,
          'registrationNumber', v.registration_number
        ) AS result
      FROM vehicle v
    ),
    railing_search AS (
      SELECT
        rr.road_railing_id::TEXT AS search_vector,
        JSON_BUILD_OBJECT(
          'type', 'RAILING',
          'id', rr.road_railing_id,
          'projectId', pp.fk_project_id,
          'projectName', p.name,
          'projectReferenceCode', p.reference_code
        ) AS result
      FROM road_railing rr
      INNER JOIN project_plan_road_railing pprr
        ON rr.road_railing_id = pprr.fk_road_railing_id
      INNER JOIN project_plan pp
        ON pprr.fk_project_plan_id = pp.project_plan_id
      INNER JOIN project p
        ON pp.fk_project_id = p.project_id
    ),
    segment_search AS (
      SELECT
        rs.road_system_reference AS search_vector,
        JSON_BUILD_OBJECT(
          'type', 'ROAD_SEGMENT',
          'id', rs.road_segment_id,
          'roadSystemReference', rs.road_system_reference,
          'railingId', rs.fk_road_railing_id,
          'projectId', pp.fk_project_id,
          'projectName', p.name,
          'projectReferenceCode', p.reference_code
        ) AS result
      FROM road_segment rs
      INNER JOIN road_railing rr
        ON rs.fk_road_railing_id = rr.road_railing_id
      INNER JOIN project_plan_road_railing pprr
        ON rr.road_railing_id = pprr.fk_road_railing_id
      INNER JOIN project_plan pp
        ON pprr.fk_project_plan_id = pp.project_plan_id
      INNER JOIN project p
        ON pp.fk_project_id = p.project_id
    )
    SELECT
      sr.result
    FROM (
      SELECT * FROM project_search
      UNION ALL
      SELECT * FROM user_search
      UNION ALL
      SELECT * FROM vehicle_search
      UNION ALL
      SELECT * FROM railing_search
      UNION ALL
      SELECT * FROM segment_search
    ) sr
    WHERE sr.search_vector ILIKE '%' || :phrase || '%'
    LIMIT 100
    OFFSET COALESCE(:offset, 0)
    """;

  public List<SearchResult> search(
      String phrase,
      int page
  ) {
    var offset = page * 100;
    var params = new MapSqlParameterSource().addValue("phrase", phrase).addValue("offset", offset);

    return this.jdbcTemplate.query(SEARCH_QUERY, params, (rs, i) -> {
      try {
        return this.objectMapper.readValue(rs.getBytes("result"), SearchResult.class);
      } catch (Exception e) {
        log.error("Failed to serialize search result: {}", e.getMessage(), e);
        return null;
      }
    });
  }

}
