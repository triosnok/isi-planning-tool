package no.isi.insight.planning.auth.service;

import java.util.Date;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.auth.TokenClaim;
import no.isi.insight.planning.auth.TokenType;
import no.isi.insight.planning.auth.UserAccountDetailsAdapter;
import no.isi.insight.planning.auth.config.JwtProperties;

@Service
@RequiredArgsConstructor
public class JwtService {
  private final JwtProperties properties;

  public static final String REFRESH_COOKIE_NAME = "refresh-token";

  /**
   * Generates a JWT token for the given authentication and token type.
   * 
   * @param authentication the authentication to generate a token for
   * @param tokenType      the type of token to generate
   * 
   * @return the generated token
   * 
   * @throws Exception if an error occurs while generating the token
   */
  public String generateToken(
      Authentication authentication,
      TokenType tokenType
  ) throws Exception {
    var secret = this.properties.getSecret(tokenType);
    var expiration = this.properties.getExpiration(tokenType);
    var principal = (UserAccountDetailsAdapter) authentication.getPrincipal();
    var user = principal.getUserAccount();

    var claims = new JWTClaimsSet.Builder().issuer(this.properties.tokenIssuer())
      .subject(user.getUserAccountId().toString())
      .claim(TokenClaim.EMAIL.name, user.getEmail())
      .claim(TokenClaim.FULL_NAME.name, user.getFullName())
      .claim(TokenClaim.ROLE.name, user.getRole().toString())
      .issueTime(new Date())
      .expirationTime(Date.from(expiration))
      .build();

    var header = new JWSHeader(JWSAlgorithm.HS256);
    var signedJWT = new SignedJWT(
      header,
      claims
    );

    var signer = new MACSigner(secret);
    signedJWT.sign(signer);

    return signedJWT.serialize();
  }

  /**
   * Parses a JWT token and verifies its signature.
   * 
   * @param token     the token to parse
   * @param tokenType the type of token to parse
   * 
   * @return the parsed token
   * 
   * @throws Exception if an error occurs while parsing the token
   */
  public SignedJWT parseToken(
      String token,
      TokenType tokenType
  ) throws Exception {
    var parsedToken = SignedJWT.parse(token);
    var verifier = new MACVerifier(this.properties.getSecret(tokenType));
    var valid = parsedToken.verify(verifier);

    if (!valid) {
      // TODO: Replace with a proper exception
      throw new RuntimeException("");
    }

    return parsedToken;
  }

  /**
   * Creates a cookie for the given refresh token.
   * 
   * @param token the refresh token to create a cookie for
   * 
   * @return the created cookie
   */
  public Cookie createRefreshTokenCookie(
      String token
  ) {
    var cookie = new Cookie(
      REFRESH_COOKIE_NAME,
      token
    );

    cookie.setHttpOnly(true);
    Long durationSeconds = this.properties.getTokenDuration(TokenType.REFRESH_TOKEN).getSeconds();
    cookie.setMaxAge(durationSeconds.intValue());
    cookie.setPath("/");

    return cookie;
  }

}
