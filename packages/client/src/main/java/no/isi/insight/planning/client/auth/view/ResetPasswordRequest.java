package no.isi.insight.planning.client.auth.view;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record ResetPasswordRequest(
  @NotBlank String code,
  @NotBlank String password,
  @NotBlank String passwordConfirmation
) {

  @AssertTrue
  boolean isValidConfirmation() {
    return this.password.equals(this.passwordConfirmation);
  }

}
