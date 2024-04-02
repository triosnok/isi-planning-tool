package no.isi.insight.planning.client.useraccount.view;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.auth.view.UserRole;

@Builder
@GenerateTypeScript
public record CreateUserAccountRequest(
  @NotBlank String fullName,
  @NotBlank String email,
  String phoneNumber,
  @NotBlank String password,
  @NotNull UserRole role
) {}
