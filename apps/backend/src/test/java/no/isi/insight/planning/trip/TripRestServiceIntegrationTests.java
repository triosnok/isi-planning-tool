package no.isi.insight.planning.trip;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.zerodep.shaded.org.apache.hc.core5.http.HttpHeaders;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.annotation.IntegrationTest;
import no.isi.insight.planning.auth.service.UserAccountService;
import no.isi.insight.planning.client.trip.view.CreateTripRequest;
import no.isi.insight.planning.client.trip.view.TripDetails;
import no.isi.insight.planning.db.model.Project;
import no.isi.insight.planning.db.model.ProjectPlan;
import no.isi.insight.planning.db.model.UserAccount;
import no.isi.insight.planning.db.model.UserAccountRole;
import no.isi.insight.planning.db.model.Vehicle;
import no.isi.insight.planning.db.repository.ProjectJpaRepository;
import no.isi.insight.planning.db.repository.ProjectPlanJpaRepository;
import no.isi.insight.planning.db.repository.VehicleJpaRepository;
import no.isi.insight.planning.utility.AuthTestUtils;

@IntegrationTest
@RequiredArgsConstructor
class TripRestServiceIntegrationTests {

  private final MockMvc mockMvc;
  private final ObjectMapper objectMapper;
  private final UserAccountService userService;
  private final AuthTestUtils authTestUtils;
  private final ProjectJpaRepository projectJpaRepository;
  private final ProjectPlanJpaRepository projectPlanJpaRepository;
  private final VehicleJpaRepository vehicleJpaRepository;

  private CreateTripRequest trip;
  private ProjectPlan projectPlan;
  private Vehicle vehicle;
  private UserAccount plannerUserAccount;
  private UserAccount driverUserAccount;

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
      vehicle.getId(),
      null,
      null
    );

    String uniquePlannerEmail = UUID.randomUUID().toString() + "@email.invalid";
    String uniqueDriverEmail = UUID.randomUUID().toString() + "@email.invalid";

    this.plannerUserAccount = this.userService
      .createAccount("Planner", uniquePlannerEmail, "", "pass", UserAccountRole.PLANNER);

    this.driverUserAccount = this.userService
      .createAccount("Driver", uniqueDriverEmail, "", "pass", UserAccountRole.DRIVER);
  }

  @Test
  void canCreateTrip() throws Exception {
    var plannerAuthorization = this.authTestUtils.generateAuthorizationHeader(this.plannerUserAccount);

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trips")
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, plannerAuthorization)
          .content(this.objectMapper.writeValueAsString(this.trip))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$.id").isString())
      .andExpect(MockMvcResultMatchers.jsonPath("$.startedAt").isString());
  }

  @Test
  void canSaveAndFindTripById() throws Exception {
    var plannerAuthorization = this.authTestUtils.generateAuthorizationHeader(this.plannerUserAccount);
    var driverAuthorization = this.authTestUtils.generateAuthorizationHeader(this.driverUserAccount);

    var savedTrip = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trips")
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, plannerAuthorization)
          .content(this.objectMapper.writeValueAsString(this.trip))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    var tripDetails = this.objectMapper.readValue(savedTrip, TripDetails.class);

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.get("/api/v1/trips/" + tripDetails.id())
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, driverAuthorization)
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$.id").isString())
      .andExpect(MockMvcResultMatchers.jsonPath("$.startedAt").isString());
  }

  @Test
  void canSaveAndFindTripByProjectId() throws Exception {
    var plannerAuthorization = this.authTestUtils.generateAuthorizationHeader(this.plannerUserAccount);
    var driverAuthorization = this.authTestUtils.generateAuthorizationHeader(this.driverUserAccount);

    var savedTrip = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trips")
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, plannerAuthorization)
          .content(this.objectMapper.writeValueAsString(this.trip))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    var tripDetails = this.objectMapper.readValue(savedTrip, TripDetails.class);

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.get("/api/v1/trips?projectId=" + projectPlan.getProject().getId())
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, driverAuthorization)

      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(tripDetails.id().toString()));
  }

  @Test
  void canSaveAndFindTripByProjectIdAndPlanId() throws Exception {
    var plannerAuthorization = this.authTestUtils.generateAuthorizationHeader(this.plannerUserAccount);
    var driverAuthorization = this.authTestUtils.generateAuthorizationHeader(this.driverUserAccount);

    var savedTrip = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trips")
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, plannerAuthorization)
          .content(this.objectMapper.writeValueAsString(this.trip))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    var tripDetails = this.objectMapper.readValue(savedTrip, TripDetails.class);

    this.mockMvc
      .perform(
        MockMvcRequestBuilders
          .get("/api/v1/trips?projectId=" + projectPlan.getProject().getId() + "&planId=" + projectPlan.getId())
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, driverAuthorization)
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(tripDetails.id().toString()));
  }

}
