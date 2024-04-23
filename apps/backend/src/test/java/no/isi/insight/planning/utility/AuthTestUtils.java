package no.isi.insight.planning.utility;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.auth.TokenType;
import no.isi.insight.planning.auth.UserAccountDetailsAdapter;
import no.isi.insight.planning.auth.service.JwtService;
import no.isi.insight.planning.db.model.UserAccount;

/**
 * Utility class containing helpers for working with authentication in integration tests.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthTestUtils {
  private final JwtService jwtService;

  /**
   * Generates a Authorization header value with a JWT Bearer token that can be used.
   * 
   * @param account the user account to generate the token for
   * 
   * @return the generated Authorization header value
   */
  public String generateAuthorizationHeader(
      UserAccount account
  ) {
    String token = null;
    try {
      var userDetails = new UserAccountDetailsAdapter(account);

      var authentication = new UsernamePasswordAuthenticationToken(
        userDetails,
        null,
        userDetails.getAuthorities()
      );

      token = this.jwtService.generateToken(authentication, TokenType.ACCESS_TOKEN);
    } catch (Exception e) {
      token = "FATAL";
      log.error("Failed to generate authorization token: {}, proceeding with FATAL as a token", e.getMessage(), e);
    }

    return "Bearer ".concat(token);
  }
}
