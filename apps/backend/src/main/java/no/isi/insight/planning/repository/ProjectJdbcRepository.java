package no.isi.insight.planning.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.project.view.ProjectDetails;

@Repository
@RequiredArgsConstructor
public class ProjectJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;

  public List<ProjectDetails> findProjects() {
    // language=sql
    var sql = """
      SELECT
        p.project_id AS id,
        p.name,
        p.reference_code AS referenceCode,
        p.starts_at,
        p.ends_at
      FROM project p
      """;

    return this.jdbcTemplate.query(
      sql,
      (rs, rowNum) -> new ProjectDetails(
        UUID.fromString(rs.getString("id")),
        rs.getString("name"),
        rs.getString("referenceCode"),
        rs.getDate("starts_at").toLocalDate(),
        rs.getDate("ends_at").toLocalDate()
      )
    );
  }
}
