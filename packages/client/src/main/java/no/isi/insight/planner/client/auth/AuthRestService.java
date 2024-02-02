package no.isi.insight.planner.client.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import no.isi.insight.planner.client.auth.view.SignInRequest;

@HttpExchange("/api/v1/auth")
public interface AuthRestService {

  @PostExchange("/sign-in")
  ResponseEntity<Void> signIn(
      SignInRequest request
  );

}
