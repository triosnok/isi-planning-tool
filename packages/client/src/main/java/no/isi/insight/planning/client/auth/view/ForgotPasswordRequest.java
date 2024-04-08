package no.isi.insight.planning.client.auth.view;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record ForgotPasswordRequest(@Email @NotBlank String email) {}
