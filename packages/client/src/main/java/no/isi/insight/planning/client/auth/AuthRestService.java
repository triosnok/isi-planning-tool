package no.isi.insight.planning.client.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import io.swagger.v3.oas.annotations.tags.Tag;
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
      @RequestBody SignInRequest request
  );

  @PostExchange("/sign-out")
  ResponseEntity<Void> signOut();

  @GetExchange("/refresh")
  ResponseEntity<SignInResponse> refresh();

}
