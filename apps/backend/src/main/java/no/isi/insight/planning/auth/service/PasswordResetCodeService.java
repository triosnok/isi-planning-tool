package no.isi.insight.planning.auth.service;

import java.time.Duration;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.auth.service.CodeGenerator.CodeType;
import no.isi.insight.planning.model.PasswordResetCode;
import no.isi.insight.planning.model.UserAccount;
import no.isi.insight.planning.repository.PasswordResetCodeJpaRepository;

@Service
@RequiredArgsConstructor
public class PasswordResetCodeService {
  private final PasswordResetCodeJpaRepository jpaRepository;

  private static final CodeGenerator ALPHANUM_CODE_GENERATOR = new CodeGenerator(CodeType.ALPHANUMERIC);
  private static final CodeGenerator NUM_CODE_GENERATOR = new CodeGenerator(CodeType.NUMERIC);

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
    var resetCode = NUM_CODE_GENERATOR.generateCode(8);
    var confirmationCode = ALPHANUM_CODE_GENERATOR.generateCode(64);

    var code = new PasswordResetCode(
      userAccount,
      resetCode,
      confirmationCode,
      Duration.ofDays(1)
    );

    this.jpaRepository.save(code);

    return resetCode;
  }

  /**
   * Finds the confirmation code for a given email and reset code.
   * 
   * @param email     the email to find the confirmation code for
   * @param resetCode the reset code to find the confirmation code for
   * 
   * @return the confirmation code if found
   */
  public Optional<String> findConfirmationCode(
      String email,
      String resetCode
  ) {
    var foundCode = this.jpaRepository.findByResetCodeAndEmail(resetCode, email);

    if (foundCode.isPresent()) {
      var code = foundCode.get();
      code.confirmationClaimed();
      this.jpaRepository.save(code);
    }

    return foundCode.map(PasswordResetCode::getConfirmationCode);
  }

  /**
   * Finds a user account for the given code if the code is valid.
   * 
   * @param confirmationCode the code to find a user account from
   * 
   * @return the user account if the code is valid
   */
  public Optional<UserAccount> findUserByValidConfirmationCode(
      String confirmationCode
  ) {
    var foundCode = this.jpaRepository.findByConfirmationCode(confirmationCode);

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
    var resetCode = this.jpaRepository.findByConfirmationCode(code);
    resetCode.ifPresent(rc -> {
      rc.markUsed();
      this.jpaRepository.save(rc);
    });
  }

}
