package no.isi.insight.planning.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import no.isi.insight.planning.model.PasswordResetCode;

public interface PasswordResetCodeJpaRepository extends Repository<PasswordResetCode, UUID> {

  PasswordResetCode save(
      PasswordResetCode code
  );

  // language=sql
  @Query("""
      SELECT c
      FROM PasswordResetCode c
      INNER JOIN c.user u
      WHERE 1=1
        AND u.email = LOWER(:email)
        AND c.resetCode = :resetCode
        AND c.confirmationClaimedAt IS NULL
        AND c.expiresAt > CURRENT_TIMESTAMP
    """)
  Optional<PasswordResetCode> findByResetCodeAndEmail(
      @Param("resetCode") String resetCode,
      @Param("email") String email
  );

  // language=sql
  @Query("""
      SELECT c
      FROM PasswordResetCode c
      JOIN FETCH c.user
      WHERE 1=1
        AND c.confirmationCode = :confirmationCode
        AND c.usedAt IS NULL
    """)
  Optional<PasswordResetCode> findByConfirmationCode(
      @Param("confirmationCode") String code
  );

  void delete(
      PasswordResetCode code
  );

}
