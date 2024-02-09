package no.isi.insight.planning.auth.config;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

import java.time.Duration;
import java.time.Instant;

import org.junit.jupiter.api.Test;

import no.isi.insight.planning.auth.TokenType;

class JwtPropertiesTests {

  @Test
  void expirationIsResolvedCorrectly() {
    var accessTokenExpiration = 1000;
    var refreshTokenExpiration = 2000;

    var props = new JwtProperties(
      "test-issuer",
      new TokenProperties(
        accessTokenExpiration,
        "access-secret"
      ),
      new TokenProperties(
        refreshTokenExpiration,
        "refresh-secret"
      )
    );

    var start = Instant.now();
    var accessTokenExpiresAt = props.getExpiration(TokenType.ACCESS_TOKEN);
    var refreshTokenExpiresAt = props.getExpiration(TokenType.REFRESH_TOKEN);

    assertEquals(1, Duration.between(start, accessTokenExpiresAt).toSeconds());
    assertEquals(2, Duration.between(start, refreshTokenExpiresAt).toSeconds());
  }

  @Test
  void durationIsCorrect() {
    var accessTokenExpiration = 1000;
    var refreshTokenExpiration = 2000;

    var props = new JwtProperties(
      "test-issuer",
      new TokenProperties(
        accessTokenExpiration,
        "access-secret"
      ),
      new TokenProperties(
        refreshTokenExpiration,
        "refresh-secret"
      )
    );

    assertEquals(Duration.ofSeconds(1), props.getTokenDuration(TokenType.ACCESS_TOKEN));
    assertEquals(Duration.ofSeconds(2), props.getTokenDuration(TokenType.REFRESH_TOKEN));
  }

  @Test
  void secretsAreResolvedCorrectly() {
    var accessSecret = "access-secret";
    var refreshSecret = "refresh-secret";

    var props = new JwtProperties(
      "test-issuer",
      new TokenProperties(
        1000,
        accessSecret
      ),
      new TokenProperties(
        2000,
        refreshSecret
      )
    );

    assertEquals(accessSecret, props.getSecret(TokenType.ACCESS_TOKEN));
    assertEquals(refreshSecret, props.getSecret(TokenType.REFRESH_TOKEN));
    assertNotEquals(props.getSecret(TokenType.ACCESS_TOKEN), props.getSecret(TokenType.REFRESH_TOKEN));
  }

}
