package no.isi.insight.planning.client.auth.view;

import jakarta.validation.constraints.NotBlank;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record SignInRequest(@NotBlank String email, @NotBlank String password) {}
