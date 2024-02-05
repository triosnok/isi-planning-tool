package no.isi.insight.planning.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import no.isi.insight.planner.client.auth.AuthRestService;
import no.isi.insight.planner.client.auth.view.SignInRequest;

@RestController
public class AuthRestServiceImpl implements AuthRestService {

  @Override
  public ResponseEntity<Void> signIn(
      SignInRequest request
  ) {
    return ResponseEntity.ok().build();
  }

}
