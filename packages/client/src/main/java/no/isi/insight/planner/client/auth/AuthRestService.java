package no.isi.insight.planner.client.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import no.isi.insight.planner.client.auth.view.SignInRequest;
import no.isi.insight.planner.client.auth.view.SignInResponse;

@HttpExchange("/api/v1/auth")
public interface AuthRestService {

  @GetExchange("/profile")
  ResponseEntity<String> profile();

  @PostExchange("/sign-in")
  ResponseEntity<SignInResponse> signIn(
      @RequestBody SignInRequest request
  );

  @GetExchange("/refresh")
  ResponseEntity<SignInResponse> refresh();

}
