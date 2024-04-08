package no.isi.insight.planning.auth.service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.model.PasswordResetCode;
import no.isi.insight.planning.model.UserAccount;
import no.isi.insight.planning.repository.PasswordResetCodeJpaRepository;

@Service
@RequiredArgsConstructor
public class PasswordResetCodeService {
  private final PasswordEncoder passwordEncoder;
  private final PasswordResetCodeJpaRepository jpaRepository;

  /**
   * Creates a new password reset code for the given user account.
   * 
   * @param userAccount the user account to create a password reset code for
   * 
   * @return the created reset code
   */
  public String createCode(
      UserAccount userAccount
  ) {
    var random = new SecureRandom();
    var value = random.ints(48, 123)
      .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
      .limit(32)
      .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
      .toString();

    var code = new PasswordResetCode(
      userAccount,
      this.passwordEncoder.encode(value),
      Duration.ofDays(1)
    );

    this.jpaRepository.save(code);

    return value;
  }

  /**
   * Finds a user account for the given code if the code is valid.
   * 
   * @param code the code to find a user account from
   * 
   * @return the user account if the code is valid
   */
  public Optional<UserAccount> findUserByValidCode(
      String code
  ) {
    var foundCode = this.jpaRepository.findByCode(this.passwordEncoder.encode(code));

    if (foundCode.isEmpty() || foundCode.get().isExpired()) {
      return Optional.empty();
    }

    return foundCode.map(PasswordResetCode::getUser);
  }

  /**
   * Marks a reset code as used
   * 
   * @param code the code to mark as used
   */
  public void markUsed(
      String code
  ) {
    var resetCode = this.jpaRepository.findByCode(code);
    resetCode.ifPresent(rc -> {
      rc.markUsed();
      this.jpaRepository.save(rc);
    });
  }

}
