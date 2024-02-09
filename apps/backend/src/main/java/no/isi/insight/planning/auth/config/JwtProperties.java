package no.isi.insight.planning.auth.config;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

import no.isi.insight.planning.auth.TokenType;

@ConfigurationProperties("no.isi.insight.planning.auth")
public record JwtProperties(
  String tokenIssuer,
  @NestedConfigurationProperty TokenProperties accessToken,
  @NestedConfigurationProperty TokenProperties refreshToken
) {

  /**
   * Get the expiration time for a given token type.
   * 
   * @param tokenType the token type to find expiration for
   * 
   * @return the expiration time for the given token type
   */
  public Instant getExpiration(
      TokenType tokenType
  ) {
    var expirationMs = switch (tokenType) {
      case ACCESS_TOKEN -> this.accessToken.expirationMs();
      case REFRESH_TOKEN -> this.refreshToken.expirationMs();
    };

    return Instant.now().plus(expirationMs, ChronoUnit.MILLIS);
  }

  /**
   * Get the duration for a given token type.
   * 
   * @param tokenType the token type to find the duration for
   * 
   * @return the duration for the given token type
   */
  public Duration getTokenDuration(
      TokenType tokenType
  ) {
    return switch (tokenType) {
      case ACCESS_TOKEN -> Duration.ofMillis(this.accessToken.expirationMs());
      case REFRESH_TOKEN -> Duration.ofMillis(this.refreshToken.expirationMs());
    };
  }

  /**
   * Get the secret for a given token type.
   * 
   * @param tokenType the token type to find the secret for
   * 
   * @return the secret for the given token type
   */
  public String getSecret(
      TokenType tokenType
  ) {
    return switch (tokenType) {
      case ACCESS_TOKEN -> this.accessToken.secret();
      case REFRESH_TOKEN -> this.refreshToken.secret();
    };
  }

}
