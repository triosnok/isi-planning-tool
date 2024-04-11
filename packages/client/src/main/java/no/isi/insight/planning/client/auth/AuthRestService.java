package no.isi.insight.planning.client.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.auth.view.ForgotPasswordRequest;
import no.isi.insight.planning.client.auth.view.GetConfirmationCodeRequest;
import no.isi.insight.planning.client.auth.view.ResetPasswordRequest;
import no.isi.insight.planning.client.auth.view.SignInRequest;
import no.isi.insight.planning.client.auth.view.SignInResponse;
import no.isi.insight.planning.client.auth.view.UserProfile;

@Tag(name = "Authentication")
@HttpExchange("/api/v1/auth")
public interface AuthRestService {

  @GetExchange("/profile")
  ResponseEntity<UserProfile> profile();

  @PostExchange("/sign-in")
  ResponseEntity<SignInResponse> signIn(
      @Validated @RequestBody SignInRequest request
  );

  @PostExchange("/sign-out")
  ResponseEntity<Void> signOut();

  @GetExchange("/refresh")
  ResponseEntity<SignInResponse> refresh();

  @PostExchange("/forgot-password")
  ResponseEntity<Void> forgotPassword(
      @Validated @RequestBody ForgotPasswordRequest request
  );

  @PostExchange("/reset-password/code")
  ResponseEntity<String> getConfirmationCode(
      @RequestBody GetConfirmationCodeRequest request
  );

  @PostExchange("/reset-password")
  ResponseEntity<Void> resetPassword(
      @Validated @RequestBody ResetPasswordRequest request
  );

}
