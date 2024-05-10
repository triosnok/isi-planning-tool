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
import no.isi.insight.planning.client.auth.view.UserRole;
import no.isi.insight.planning.client.auth.view.UserStatus;
import no.isi.insight.planning.client.useraccount.view.UserAccountDetails;

@Repository
@RequiredArgsConstructor
public class UserAccountJdbcRepository {
  private final NamedParameterJdbcTemplate jdbcTemplate;

  // language=sql
  private static final String USER_ACCOUNT_DETAILS_QUERY = """
      WITH active_trips AS (
        SELECT
          t.fk_driver_user_id,
          COUNT(*) AS count
        FROM trip t
        WHERE t.ended_at IS NULL
        GROUP BY 1
      )
      SELECT
        ua.user_account_id,
        ua.full_name,
        ua.email,
        ua.image_url,
        ua.phone_number,
        ua.role,
        at.count
      FROM user_account ua
      LEFT JOIN active_trips at
        ON ua.user_account_id = at.fk_driver_user_id
      WHERE 1=1
        AND (:id IS NULL OR ua.user_account_id = :id::uuid)
      ORDER BY ua.full_name ASC
    """;

  private static final RowMapper<UserAccountDetails> USER_ACCOUNT_DETAILS_MAPPER = (rs, i) -> {
    var id = rs.getString("user_account_id");

    if (rs.wasNull()) {
      return null;
    }

    var status = switch (rs.getInt("count")) {
      case 0 -> UserStatus.AVAILABLE;
      default -> UserStatus.DRIVING;
    };

    return UserAccountDetails.builder()
      .id(UUID.fromString(id))
      .fullName(rs.getString("full_name"))
      .email(rs.getString("email"))
      .imageUrl(rs.getString("image_url"))
      .phoneNumber(rs.getString("phone_number"))
      .role(UserRole.fromString(rs.getString("role")))
      .status(status)
      .build();
  };

  public List<UserAccountDetails> findAll(
      Optional<UUID> id
  ) {
    var params = new MapSqlParameterSource().addValue("id", id.orElse(null), Types.VARCHAR);
    return this.jdbcTemplate.query(USER_ACCOUNT_DETAILS_QUERY, params, USER_ACCOUNT_DETAILS_MAPPER);
  }

  public List<UserAccountDetails> findAll() {
    return this.findAll(Optional.empty());
  }

  public Optional<UserAccountDetails> findById(
      UUID id
  ) {
    var list = this.findAll(Optional.of(id));

    if (list.size() > 1) {
      throw new IllegalStateException("Found multiple user accounts with id: %s".formatted(id));
    }

    return list.stream().findFirst();
  }

}
