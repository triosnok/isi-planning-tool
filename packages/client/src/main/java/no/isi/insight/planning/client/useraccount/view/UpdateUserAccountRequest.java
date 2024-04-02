package no.isi.insight.planning.client.useraccount.view;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.auth.view.UserRole;

@Builder
@GenerateTypeScript
public record UpdateUserAccountRequest(
  @NotBlank String fullName,
  @NotBlank String email,
  String phoneNumber,
  @NotBlank String password,
  @NotBlank String passwordConfirmation,
  @NotNull UserRole role
) {

  @AssertTrue
  boolean isPasswordConfirmationValid() {
    return this.password.equals(this.passwordConfirmation);
  }
}
