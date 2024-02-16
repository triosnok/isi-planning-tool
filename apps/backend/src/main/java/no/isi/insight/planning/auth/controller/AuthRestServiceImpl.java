package no.isi.insight.planning.auth.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.WebUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planner.client.auth.AuthRestService;
import no.isi.insight.planner.client.auth.view.SignInRequest;
import no.isi.insight.planner.client.auth.view.SignInResponse;
import no.isi.insight.planner.client.auth.view.UserProfile;
import no.isi.insight.planner.client.auth.view.UserRole;
import no.isi.insight.planning.auth.TokenClaim;
import no.isi.insight.planning.auth.TokenType;
import no.isi.insight.planning.auth.UserAccountDetailsAdapter;
import no.isi.insight.planning.auth.annotation.Authenticated;
import no.isi.insight.planning.auth.service.JwtService;
import no.isi.insight.planning.repository.UserAccountJpaRepository;
import no.isi.insight.planning.utility.RequestUtils;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthRestServiceImpl implements AuthRestService {
  private final AuthenticationManager authenticationManager;
  private final UserAccountJpaRepository userAccountJpaRepository;
  private final JwtService jwtService;

  @Override
  @Authenticated
  public ResponseEntity<UserProfile> profile() {
    var user = (UserAccountDetailsAdapter) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    var account = user.getUserAccount();
    var role = switch (account.getRole()) {
      case DRIVER -> UserRole.DRIVER;
      case PLANNER -> UserRole.PLANNER;
    };

    var profile = UserProfile.builder()
      .fullName(account.getFullName())
      .email(account.getEmail())
      .phoneNumber(account.getPhoneNumber())
      .role(role)
      .build();

    return ResponseEntity.ok(profile);
  }

  @Override
  public ResponseEntity<SignInResponse> signIn(
      SignInRequest request
  ) {
    var authentication = this.authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        request.email(),
        request.password()
      )
    );

    try {
      var response = RequestUtils.getServletResponse();
      var accessToken = this.jwtService.generateToken(authentication, TokenType.ACCESS_TOKEN);
      var refreshToken = this.jwtService.generateToken(authentication, TokenType.REFRESH_TOKEN);
      response.addCookie(this.jwtService.createRefreshTokenCookie(refreshToken));
      return ResponseEntity.ok(new SignInResponse(accessToken));
    } catch (Exception e) {
      log.error("Failed to generate token for user [email={}]: {}", request.email(), e.getMessage());
      return ResponseEntity.internalServerError().build();
    }
  }

  @Override
  public ResponseEntity<SignInResponse> refresh() {
    var request = RequestUtils.getServletRequest();
    var refreshToken = Optional.ofNullable(WebUtils.getCookie(request, JwtService.REFRESH_COOKIE_NAME));

    if (refreshToken.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    try {
      var parsed = this.jwtService.parseToken(refreshToken.get().getValue(), TokenType.REFRESH_TOKEN);
      var email = (String) parsed.getJWTClaimsSet().getClaim(TokenClaim.EMAIL.name);
      var foundUser = this.userAccountJpaRepository.findByEmail(email);

      if (foundUser.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      var userDetails = foundUser.map(UserAccountDetailsAdapter::new).get();
      var authentication = new UsernamePasswordAuthenticationToken(
        userDetails,
        null,
        userDetails.getAuthorities()
      );

      var accessToken = this.jwtService.generateToken(authentication, TokenType.ACCESS_TOKEN);
      return ResponseEntity.ok(new SignInResponse(accessToken));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
  }

  @Override
  public ResponseEntity<Void> signOut() {
    var request = RequestUtils.getServletRequest();
    var refreshToken = Optional.ofNullable(WebUtils.getCookie(request, JwtService.REFRESH_COOKIE_NAME));

    if (refreshToken.isEmpty()) {
      return ResponseEntity.ok().build();
    }

    var cookie = this.jwtService.createRefreshTokenCookie(refreshToken.get().getValue());
    cookie.setMaxAge(0);

    var response = RequestUtils.getServletResponse();
    response.addCookie(cookie);

    return ResponseEntity.ok().build();
  }
}
