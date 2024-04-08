package no.isi.insight.planning.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import no.isi.insight.planning.model.PasswordResetCode;

public interface PasswordResetCodeJpaRepository extends Repository<PasswordResetCode, String> {

  PasswordResetCode save(
      PasswordResetCode code
  );

  // language=sql
  @Query("SELECT c FROM PasswordResetCode c JOIN FETCH c.user WHERE c.code = :code")
  Optional<PasswordResetCode> findByCode(
      @Param("code") String code
  );

}
