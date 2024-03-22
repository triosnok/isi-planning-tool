package no.insight.simulator;

import java.time.Instant;
import java.util.regex.Pattern;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planner.client.auth.AuthRestService;
import no.isi.insight.planner.client.auth.view.SignInRequest;

@Slf4j
@Component
@RequiredArgsConstructor
public class PlanningClientAuthentication {
  private final AuthRestService authRestService;
  private final PlanningClientProperties properties;

  private static final Pattern REFRESH_TOKEN_PATTERN = Pattern.compile("refresh-token=([^;]+)");

  private TokenDetails accessToken;
  private TokenDetails refreshToken;

  public synchronized String getAccessToken() {
    if (this.accessToken != null && this.accessToken.isExpired() && this.refreshToken.isExpired()) {
      this.authenticate();
    }

    return this.accessToken.token;
  }

  public synchronized String getRefreshToken() {
    if (this.refreshToken != null && this.refreshToken.isExpired()) {
      this.authenticate();
    }

    return this.refreshToken.token;
  }

  private void authenticate() {
    if (this.refreshToken != null && !this.refreshToken.isExpired()) {
      var response = this.authRestService.refresh();
      this.accessToken = new TokenDetails(response.getBody().accessToken());
    }

    var response = this.authRestService.signIn(
      new SignInRequest(
        this.properties.username(),
        this.properties.password()
      )
    );

    if (!response.getStatusCode().is2xxSuccessful()) {
      log.error("Something went wrong when trying to authenticate, status code: {}", response.getStatusCode().value());
    }

    var setCookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
    var matcher = REFRESH_TOKEN_PATTERN.matcher(setCookie);
    var refreshToken = matcher.group(1);

    this.refreshToken = new TokenDetails(refreshToken);
    this.accessToken = new TokenDetails(response.getBody().accessToken());
  }

  private static class TokenDetails {
    private final String token;
    private final Instant expiresAt;

    public TokenDetails(
        String token
    ) {
      this.token = token;
      this.expiresAt = Instant.now().plusSeconds(3600);
    }

    public boolean isExpired() {
      return this.expiresAt.isBefore(Instant.now());
    }
  }
}
