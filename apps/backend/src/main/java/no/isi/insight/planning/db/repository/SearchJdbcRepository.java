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
        json_build_object(
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
        json_build_object(
          'type', 'USER',
          'id', u.user_account_id,
          'fullName', u.full_name
        ) AS result
      FROM user_account u
    ),
    vehicle_search AS (
      SELECT
        v.model || ' ' || v.registration_number || ' ' || v.gnss_id AS search_vector,
        json_build_object(
          'type', 'VEHICLE',
          'id', v.vehicle_id,
          'model', v.model,
          'registrationNumber', v.registration_number
        ) AS result
      FROM vehicle v
    )
    SELECT
      sr.result
    FROM (
      SELECT * FROM project_search
      UNION ALL
      SELECT * FROM user_search
      UNION ALL
      SELECT * FROM vehicle_search
    ) sr
    WHERE sr.search_vector ILIKE '%' || :phrase || '%'
    LIMIT 500
    OFFSET COALESCE(:offset, 0)
    """;

  public List<SearchResult> search(
      String phrase,
      int page
  ) {
    var offset = page * 500;
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
