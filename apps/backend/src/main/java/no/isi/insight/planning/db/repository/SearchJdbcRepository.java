package no.isi.insight.planning.db.repository;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.client.search.view.SearchResult;

@Repository
@RequiredArgsConstructor
public class SearchJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;
  private final ObjectMapper objectMapper;

  // language=sql
  private static final String SEARCH_QUERY = """
    WITH project_search AS (
      SELECT
        p.name AS search_vector,
        json_build_object(
          'type', 'PROJECT',
          'id', p.project_id,
          'name', p.name
        ) AS result
      FROM project p
    ),
    user_search AS (
      SELECT
        u.full_name AS search_vector,
        json_build_object(
          'type', 'USER',
          'id', u.user_account_id,
          'fullName', u.full_name
        ) AS result
      FROM user_account u
    ),
    vehicle_search AS (
      SELECT
        v.model || ' ' || v.registration_number AS search_vector,
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
    """;

  public List<SearchResult> search(
      String phrase
  ) {
    return this.jdbcTemplate.query(SEARCH_QUERY, Map.of("phrase", phrase), (rs, i) -> {
      try {
        return this.objectMapper.readValue(rs.getBytes("result"), SearchResult.class);
      } catch (Exception e) {
        return null;
      }
    });
  }

}
