package no.isi.insight.planning.auth.controller;

import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.WebUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.auth.TokenType;
import no.isi.insight.planning.auth.UserAccountDetailsAdapter;
import no.isi.insight.planning.auth.annotation.Authenticated;
import no.isi.insight.planning.auth.service.JwtService;
import no.isi.insight.planning.auth.service.PasswordResetCodeService;
import no.isi.insight.planning.auth.service.UserAccountService;
import no.isi.insight.planning.client.auth.AuthRestService;
import no.isi.insight.planning.client.auth.view.ForgotPasswordRequest;
import no.isi.insight.planning.client.auth.view.GetConfirmationCodeRequest;
import no.isi.insight.planning.client.auth.view.ResetPasswordRequest;
import no.isi.insight.planning.client.auth.view.SignInRequest;
import no.isi.insight.planning.client.auth.view.SignInResponse;
import no.isi.insight.planning.client.auth.view.UserProfile;
import no.isi.insight.planning.client.auth.view.UserRole;
import no.isi.insight.planning.error.model.UnauthorizedException;
import no.isi.insight.planning.integration.mail.MailService;
import no.isi.insight.planning.repository.UserAccountJpaRepository;
import no.isi.insight.planning.utility.RequestUtils;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthRestServiceImpl implements AuthRestService {
  private final AuthenticationManager authenticationManager;
  private final UserAccountJpaRepository userAccountJpaRepository;
  private final JwtService jwtService;
  private final UserAccountService userAccountService;
  private final PasswordResetCodeService passwordResetCodeService;
  private final MailService mailService;

  @Override
  @Authenticated
  public ResponseEntity<UserProfile> profile() {
    var account = RequestUtils.getRequestingUserAccount().orElseThrow(() -> new IllegalStateException("Cannot happen"));
    var role = switch (account.getRole()) {
      case DRIVER -> UserRole.DRIVER;
      case PLANNER -> UserRole.PLANNER;
    };

    var profile = UserProfile.builder()
      .id(account.getUserAccountId())
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
      response.addCookie(this.jwtService.createTokenCookie(TokenType.ACCESS_TOKEN, accessToken));
      response.addCookie(this.jwtService.createTokenCookie(TokenType.REFRESH_TOKEN, refreshToken));
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
      var id = UUID.fromString(parsed.getJWTClaimsSet().getSubject());
      var foundUser = this.userAccountJpaRepository.findById(id);

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
      var response = RequestUtils.getServletResponse();
      response.addCookie(this.jwtService.createTokenCookie(TokenType.ACCESS_TOKEN, accessToken));
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

    var refreshCookie = this.jwtService.createTokenCookie(TokenType.REFRESH_TOKEN, "");
    refreshCookie.setMaxAge(0);

    var accessCookie = this.jwtService.createTokenCookie(TokenType.ACCESS_TOKEN, "");
    accessCookie.setMaxAge(0);

    var response = RequestUtils.getServletResponse();

    response.addCookie(refreshCookie);
    response.addCookie(accessCookie);

    return ResponseEntity.ok().build();
  }

  @Override
  public ResponseEntity<Void> forgotPassword(
      ForgotPasswordRequest request
  ) {
    this.userAccountJpaRepository.findByEmail(request.email()).ifPresent(user -> {
      var code = this.passwordResetCodeService.createCode(user);
      this.mailService.send(user, "Password reset confirmation", "Your password reset code is: %s".formatted(code));
    });

    return ResponseEntity.ok().build();
  }

  @Override
  public ResponseEntity<String> getConfirmationCode(
      GetConfirmationCodeRequest request
  ) {
    var code = this.passwordResetCodeService.findConfirmationCode(request.email(), request.code())
      .orElseThrow(() -> new UnauthorizedException("Invalid code"));

    return ResponseEntity.ok(code);
  }

  @Override
  public ResponseEntity<Void> resetPassword(
      ResetPasswordRequest request
  ) {
    var foundUser = this.passwordResetCodeService.findUserByValidConfirmationCode(request.code());

    if (foundUser.isPresent()) {
      var user = foundUser.get();

      this.userAccountService.updateAccount(
        user.getUserAccountId(),
        user.getFullName(),
        user.getEmail(),
        user.getPhoneNumber(),
        request.password(),
        true,
        user.getRole()
      );

      this.passwordResetCodeService.markUsed(request.code());
    }

    return ResponseEntity.ok().build();
  }

}
