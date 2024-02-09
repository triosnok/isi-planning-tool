package no.isi.insight.planning.auth;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.auth.view.SignInRequest;
import no.isi.insight.planning.annotation.IntegrationTest;
import no.isi.insight.planning.auth.service.JwtService;
import no.isi.insight.planning.auth.service.UserAccountService;
import no.isi.insight.planning.model.UserAccount;
import no.isi.insight.planning.model.UserAccountRole;

@IntegrationTest
@RequiredArgsConstructor
class AuthRestServiceIntegrationTests {
  private final UserAccountService userService;
  private final ObjectMapper objectMapper;
  private final MockMvc mockMvc;

  private UserAccount driver;
  private UserAccount planner;

  @BeforeEach
  void setup() {
    this.driver = this.userService.createAccount("Driver", "driver@email.invalid", "", "pass", UserAccountRole.DRIVER);
    this.planner = this.userService
      .createAccount("Planner", "planner@email.invalid", "", "anotherpass", UserAccountRole.DRIVER);
  }

  @AfterEach
  void cleanup() {
    this.userService.deleteAccount(this.driver);
    this.userService.deleteAccount(this.planner);
  }

  @Test
  void driverCanSignInSuccesfully() throws Exception {
    var driverSignIn = new SignInRequest(
      "driver@email.invalid",
      "pass"
    );

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/auth/sign-in")
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(driverSignIn))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.cookie().exists(JwtService.REFRESH_COOKIE_NAME))
      .andExpect(MockMvcResultMatchers.jsonPath("$.accessToken").isString());
  }

  @Test
  void plannerCanSignInSuccesfully() throws Exception {
    var plannerSignIn = new SignInRequest(
      "planner@email.invalid",
      "anotherpass"
    );

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/auth/sign-in")
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(plannerSignIn))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.cookie().exists(JwtService.REFRESH_COOKIE_NAME))
      .andExpect(MockMvcResultMatchers.jsonPath("$.accessToken").isString());
  }

  @Test
  void cannotSignInWithoutCorrectCredentials() throws Exception {
    var testSignIn = new SignInRequest(
      "some-invalid@email.invalid",
      "something-invalid"
    );

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/auth/sign-in")
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(testSignIn))
      )
      .andExpect(MockMvcResultMatchers.status().isForbidden())
      .andExpect(MockMvcResultMatchers.cookie().doesNotExist(JwtService.REFRESH_COOKIE_NAME));
  }

  @Test
  void canRefreshToken() throws Exception {
    var plannerSignIn = new SignInRequest(
      "planner@email.invalid",
      "anotherpass"
    );

    var result = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/auth/sign-in")
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(plannerSignIn))
      )
      .andReturn()
      .getResponse();

    var refreshTokenCookie = result.getCookie(JwtService.REFRESH_COOKIE_NAME);

    this.mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/auth/refresh").cookie(refreshTokenCookie))
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$.accessToken").isString());
  }

  @Test
  void canSignOut() throws Exception {
    var plannerSignIn = new SignInRequest(
      "planner@email.invalid",
      "anotherpass"
    );

    var result = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/auth/sign-in")
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(plannerSignIn))
      )
      .andReturn()
      .getResponse();

    var refreshTokenCookie = result.getCookie(JwtService.REFRESH_COOKIE_NAME);

    this.mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/auth/sign-out").cookie(refreshTokenCookie))
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.cookie().exists(JwtService.REFRESH_COOKIE_NAME))
      .andExpect(MockMvcResultMatchers.cookie().maxAge(JwtService.REFRESH_COOKIE_NAME, 0));
  }

}
