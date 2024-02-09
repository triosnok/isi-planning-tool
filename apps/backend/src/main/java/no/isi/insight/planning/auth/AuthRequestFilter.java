package no.isi.insight.planning.auth;

import java.io.IOException;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

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

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain
  ) throws ServletException, IOException {
    var header = request.getHeader("Authorization");
    var prefix = "Bearer ";

    if (header == null || !header.startsWith(prefix)) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      var token = header.substring(prefix.length());
      var parsedToken = this.jwtService.parseToken(token, TokenType.ACCESS_TOKEN);
      var email = (String) parsedToken.getJWTClaimsSet().getClaim(TokenClaim.EMAIL.name);
      var foundUser = this.userAccountJpaRepository.findByEmail(email);

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
      log.debug("Failed to parse token to identify user: {}", e.getMessage());
    }

    filterChain.doFilter(request, response);
  }

}
