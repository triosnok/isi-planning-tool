package no.isi.insight.planning.auth;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.auth.service.JwtService;
import no.isi.insight.planning.repository.UserAccountJpaRepository;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthRequestFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  private final UserAccountJpaRepository userAccountJpaRepository;

  private static final String HEADER_PREFIX = "Bearer ";

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain
  ) throws ServletException, IOException {
    var header = request.getHeader("Authorization");
    var bearerToken = Optional.ofNullable(header)
      .filter(t -> t.startsWith(HEADER_PREFIX))
      .map(t -> t.substring(HEADER_PREFIX.length()).trim());

    var cookie = Optional.ofNullable(WebUtils.getCookie(request, JwtService.ACCESS_COOKIE_NAME)).map(c -> c.getValue());

    if (bearerToken.isEmpty() && cookie.isEmpty()) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      var token = cookie.orElseGet(bearerToken::get);
      var parsedToken = this.jwtService.parseToken(token, TokenType.ACCESS_TOKEN);
      var userId = UUID.fromString(parsedToken.getJWTClaimsSet().getSubject());
      var foundUser = this.userAccountJpaRepository.findById(userId);

      foundUser.ifPresent(user -> {
        var userDetails = new UserAccountDetailsAdapter(user);
        var authentication = new UsernamePasswordAuthenticationToken(
          userDetails,
          null,
          userDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
      });

    } catch (Exception e) {
      log.error("Failed to parse token to identify user: {}", e.getMessage());
    }

    filterChain.doFilter(request, response);
  }

}
