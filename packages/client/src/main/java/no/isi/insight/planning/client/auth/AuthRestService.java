package no.isi.insight.planning.client.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.auth.view.ForgotPasswordRequest;
import no.isi.insight.planning.client.auth.view.GetConfirmationCodeRequest;
import no.isi.insight.planning.client.auth.view.ResetPasswordRequest;
import no.isi.insight.planning.client.auth.view.SignInRequest;
import no.isi.insight.planning.client.auth.view.SignInResponse;
import no.isi.insight.planning.client.auth.view.UserProfile;

@Tag(name = "Authentication", description = "Operations related to authenticating user accounts")
@HttpExchange("/api/v1/auth")
public interface AuthRestService {

  @Operation(summary = "Returns the profile of the authenticated user")
  @GetExchange("/profile")
  ResponseEntity<UserProfile> profile();

  @Operation(summary = "Signs in a user")
  @PostExchange("/sign-in")
  ResponseEntity<SignInResponse> signIn(
      @Validated @RequestBody SignInRequest request
  );

  @Operation(summary = "Signs out the currently logged in user")
  @PostExchange("/sign-out")
  ResponseEntity<Void> signOut();

  @Operation(summary = "Retrieves a new access token for the logged in user")
  @GetExchange("/refresh")
  ResponseEntity<SignInResponse> refresh();

  @Operation(summary = "Sends a password reset email to the user")
  @PostExchange("/forgot-password")
  ResponseEntity<Void> forgotPassword(
      @Validated @RequestBody ForgotPasswordRequest request
  );

  @Operation(summary = "Confirms the password reset code and returns a code for resetting the password")
  @PostExchange("/reset-password/code")
  ResponseEntity<String> getConfirmationCode(
      @RequestBody GetConfirmationCodeRequest request
  );

  @Operation(summary = "Resets the password of the user")
  @PostExchange("/reset-password")
  ResponseEntity<Void> resetPassword(
      @Validated @RequestBody ResetPasswordRequest request
  );

}
