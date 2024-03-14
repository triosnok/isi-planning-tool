package no.isi.insight.planning.trip;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.json.JacksonJsonParser;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.zerodep.shaded.org.apache.hc.core5.http.HttpHeaders;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.auth.view.SignInRequest;
import no.isi.insight.planner.client.trip.view.CreateTripRequest;
import no.isi.insight.planning.annotation.IntegrationTest;
import no.isi.insight.planning.auth.service.UserAccountService;
import no.isi.insight.planning.model.Project;
import no.isi.insight.planning.model.ProjectPlan;
import no.isi.insight.planning.model.Trip;
import no.isi.insight.planning.model.UserAccount;
import no.isi.insight.planning.model.UserAccountRole;
import no.isi.insight.planning.model.Vehicle;
import no.isi.insight.planning.repository.ProjectJpaRepository;
import no.isi.insight.planning.repository.ProjectPlanJpaRepository;
import no.isi.insight.planning.repository.UserAccountJpaRepository;
import no.isi.insight.planning.repository.VehicleJpaRepository;

@IntegrationTest
@RequiredArgsConstructor
class TripRestServiceIntegrationTests {

  private final MockMvc mockMvc;
  private final ObjectMapper objectMapper;
  private final UserAccountService userService;

  private CreateTripRequest trip;

  private ProjectPlan projectPlan;
  private Vehicle vehicle;
  private UserAccount userAccount;

  private final ProjectJpaRepository projectJpaRepository;
  private final ProjectPlanJpaRepository projectPlanJpaRepository;
  private final VehicleJpaRepository vehicleJpaRepository;
  private final UserAccountJpaRepository userAccountJpaRepository;

  @BeforeEach
  void setUp() throws JsonProcessingException, Exception {
    var project = new Project(
      "Test project",
      "Test project description",
      LocalDate.now(),
      LocalDate.now().plusDays(20)
    );

    projectPlan = new ProjectPlan(
      project,
      List.of(
        "https://nvdbapiles-v3.atlas.vegvesen.no/vegobjekter/5?kartutsnitt=202904.867,6875662.022,205444.872,6876933.348&segmentering=true&inkluder=metadata,lokasjon,geometri"
      ),
      LocalDate.now(),
      LocalDate.now().plusDays(20)
    );

    vehicle = new Vehicle(
      "https://picsum.photos/300/200",
      "REF5232949",
      "model",
      true,
      "car",
      "9230-234923940-42394"
    );

    projectJpaRepository.save(project);
    projectPlanJpaRepository.save(projectPlan);
    vehicleJpaRepository.save(vehicle);

    this.trip = new CreateTripRequest(
      projectPlan.getId(),
      vehicle.getId()
    );

    String uniqueEmail = "driverUserTrip+" + UUID.randomUUID().toString() + "@email.invalid";

    this.userAccount = this.userAccountJpaRepository.save(
      this.userAccount = this.userService.createAccount("Driver", uniqueEmail, "", "pass", UserAccountRole.DRIVER)
    );
  }

  @Test
  void canCreateTrip() throws Exception {
    var accessToken = obtainAccessToken(userAccount.getEmail(), "pass");

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trips")
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
          .content(this.objectMapper.writeValueAsString(this.trip))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$.id").isString())
      .andExpect(MockMvcResultMatchers.jsonPath("$.startedAt").isString());
  }

  @Test
  void canSaveAndFindTripById() throws Exception {
    var accessToken = obtainAccessToken(userAccount.getEmail(), "pass");

    var savedTrip = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trips")
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
          .content(this.objectMapper.writeValueAsString(this.trip))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    var tripDetails = this.objectMapper.readValue(savedTrip, Trip.class);

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.get("/api/v1/trips/" + tripDetails.getId()).contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$.id").isString())
      .andExpect(MockMvcResultMatchers.jsonPath("$.startedAt").isString());
  }

  @Test
  void canSaveAndFindTripByProjectId() throws Exception {
    var accessToken = obtainAccessToken(userAccount.getEmail(), "pass");

    var savedTrip = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trips")
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
          .content(this.objectMapper.writeValueAsString(this.trip))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    var tripDetails = this.objectMapper.readValue(savedTrip, Trip.class);

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.get("/api/v1/trips?projectId=" + projectPlan.getProject().getId())
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(tripDetails.getId().toString()));
  }

  @Test
  void canSaveAndFindTripByProjectIdAndPlanId() throws Exception {
    var accessToken = obtainAccessToken(userAccount.getEmail(), "pass");

    var savedTrip = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trips")
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
          .content(this.objectMapper.writeValueAsString(this.trip))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    var tripDetails = this.objectMapper.readValue(savedTrip, Trip.class);

    this.mockMvc
      .perform(
        MockMvcRequestBuilders
          .get("/api/v1/trips?projectId=" + projectPlan.getProject().getId() + "&planId=" + projectPlan.getId())
          .contentType(MediaType.APPLICATION_JSON)
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(tripDetails.getId().toString()));
  }

  private String obtainAccessToken(
      String username,
      String password
  ) throws Exception {
    var signInRequest = new SignInRequest(
      username,
      password
    );

    var result = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/auth/sign-in")
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(signInRequest))
      )
      .andReturn()
      .getResponse();

    var content = result.getContentAsString();
    var parser = new JacksonJsonParser();
    var token = parser.parseMap(content).get("accessToken").toString();

    return token;
  }
}
