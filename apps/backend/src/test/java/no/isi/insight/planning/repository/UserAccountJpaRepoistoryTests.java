package no.isi.insight.planning.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.PlanningApplicationDevelopment;
import no.isi.insight.planning.model.UserAccount;
import no.isi.insight.planning.model.UserAccountRole;

@DataJpaTest
@RequiredArgsConstructor
@Import(PlanningApplicationDevelopment.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserAccountJpaRepoistoryTests {

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
