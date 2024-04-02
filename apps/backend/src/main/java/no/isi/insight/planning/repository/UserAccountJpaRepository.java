package no.isi.insight.planning.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.Repository;

import no.isi.insight.planning.model.UserAccount;

public interface UserAccountJpaRepository extends Repository<UserAccount, UUID> {

  Optional<UserAccount> findByEmail(
      String email
  );

  UserAccount save(
      UserAccount userAccount
  );

  void delete(
      UserAccount userAccount
  );

  Optional<UserAccount> findById(
      UUID id
  );

  List<UserAccount> findAll();

}
