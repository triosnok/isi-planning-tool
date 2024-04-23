package no.isi.insight.planning.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.auth.UserAccountDetailsAdapter;
import no.isi.insight.planning.db.repository.UserAccountJpaRepository;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
  private final UserAccountJpaRepository userAccountJpaRepository;

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  AuthenticationManager authenticationManager(
      AuthenticationConfiguration configuration
  ) throws Exception {
    return configuration.getAuthenticationManager();
  }

  @Bean
  DaoAuthenticationProvider daoAuthenticationProvider() {
    var provider = new DaoAuthenticationProvider();

    provider.setPasswordEncoder(this.passwordEncoder());
    provider.setUserDetailsService(
      email -> new UserAccountDetailsAdapter(
        this.userAccountJpaRepository.findByEmail(email)
          .orElseThrow(() -> new UsernameNotFoundException("Could not find user with email: " + email))
      )
    );

    return provider;
  }

  @Bean
  SecurityFilterChain securityFilterChain(
      HttpSecurity http
  ) throws Exception {
    http.csrf(csrf -> csrf.disable())
      .sessionManagement(sessionMgmt -> sessionMgmt.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authorizeHttpRequests(auth -> auth.requestMatchers("/**").permitAll());

    return http.build();
  }

}
