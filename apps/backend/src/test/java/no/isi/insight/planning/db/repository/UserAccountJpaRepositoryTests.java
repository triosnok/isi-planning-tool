package no.isi.insight.planning.db.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.annotation.IntegrationTest;
import no.isi.insight.planning.db.model.UserAccount;
import no.isi.insight.planning.db.model.UserAccountRole;

@IntegrationTest
@RequiredArgsConstructor
class UserAccountJpaRepositoryTests {

  private final UserAccountJpaRepository userAccountJpaRepository;

  @Test
  void canSaveAndFindUserAccount() {

    UserAccount newUser = new UserAccount(
      "Martin Skibidi",
      "martin.skibidi@gmail.com",
      "12-456-789",
      "password",
      UserAccountRole.PLANNER
    );

    UserAccount savedUser = userAccountJpaRepository.save(newUser);

    assertEquals(newUser, savedUser);
    assertEquals(newUser.getUserAccountId(), savedUser.getUserAccountId());
    assertEquals(newUser.getFullName(), savedUser.getFullName());

    var foundUser = userAccountJpaRepository.findByEmail(savedUser.getEmail()).get();

    assertEquals(UserAccountRole.PLANNER, foundUser.getRole());
    assertEquals(savedUser.getEmail(), foundUser.getEmail());

  }
}
