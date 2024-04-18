package no.isi.insight.planning.trip;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
import no.isi.insight.planning.client.trip.view.CreateTripNoteRequest;
import no.isi.insight.planning.client.trip.view.UpdateTripNoteRequest;
import no.isi.insight.planning.model.Project;
import no.isi.insight.planning.model.ProjectPlan;
import no.isi.insight.planning.model.Trip;
import no.isi.insight.planning.model.UserAccount;
import no.isi.insight.planning.model.UserAccountRole;
import no.isi.insight.planning.model.Vehicle;
import no.isi.insight.planning.repository.ProjectJpaRepository;
import no.isi.insight.planning.repository.ProjectPlanJpaRepository;
import no.isi.insight.planning.repository.TripJpaRepository;
import no.isi.insight.planning.repository.VehicleJpaRepository;
import no.isi.insight.planning.utility.AuthTestUtils;

@IntegrationTest
@RequiredArgsConstructor
class TripNoteRestServiceIntegrationTests {

  private final MockMvc mockMvc;
  private final ObjectMapper objectMapper;
  private final UserAccountService userService;
  private final AuthTestUtils authTestUtils;
  private final ProjectJpaRepository projectJpaRepository;
  private final ProjectPlanJpaRepository projectPlanJpaRepository;
  private final VehicleJpaRepository vehicleJpaRepository;
  private final TripJpaRepository tripJpaRepository;

  private CreateTripNoteRequest tripNote;
  private Trip trip;
  private ProjectPlan projectPlan;
  private Vehicle vehicle;
  private UserAccount userAccount;

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

    String uniqueEmail = UUID.randomUUID().toString() + "@email.invalid";
    this.userAccount = this.userService.createAccount("Driver", uniqueEmail, "", "pass", UserAccountRole.DRIVER);

    trip = new Trip(
      vehicle,
      userAccount,
      projectPlan,
      LocalDateTime.now(),
      0
    );

    this.trip = this.tripJpaRepository.save(trip);

    this.tripNote = new CreateTripNoteRequest(
      trip.getId(),
      "Note"
    );
  }

  @Test
  void canCreateTripNote() throws Exception {
    var authorization = this.authTestUtils.generateAuthorizationHeader(this.userAccount);

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trip-notes")
          .header(HttpHeaders.AUTHORIZATION, authorization)
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(this.tripNote))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$.id").isString())
      .andExpect(MockMvcResultMatchers.jsonPath("$.note").isString());
  }

  @Test
  void canUpdateTripNote() throws Exception {
    var authorization = this.authTestUtils.generateAuthorizationHeader(this.userAccount);

    var response = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trip-notes")
          .header(HttpHeaders.AUTHORIZATION, authorization)
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(this.tripNote))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn();

    var noteId = this.objectMapper.readTree(response.getResponse().getContentAsString()).get("id").asText();

    var updateTripNote = new UpdateTripNoteRequest("Updated note");

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.put("/api/v1/trip-notes/" + noteId)
          .header(HttpHeaders.AUTHORIZATION, authorization)
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(updateTripNote))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$.id").isString())
      .andExpect(MockMvcResultMatchers.jsonPath("$.note").value("Updated note"));
  }

  @Test
  void canFindTripNotesByTripId() throws Exception {
    var authorization = this.authTestUtils.generateAuthorizationHeader(this.userAccount);

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trip-notes")
          .header(HttpHeaders.AUTHORIZATION, authorization)
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(this.tripNote))
      )
      .andExpect(MockMvcResultMatchers.status().isOk());

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.get("/api/v1/trip-notes")
          .header(HttpHeaders.AUTHORIZATION, authorization)
          .param("tripId", this.trip.getId().toString())
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").isString())
      .andExpect(MockMvcResultMatchers.jsonPath("$[0].note").isString());

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.get("/api/v1/trip-notes")
          .header(HttpHeaders.AUTHORIZATION, authorization)
          .param("tripId", this.trip.getId().toString())
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").doesNotExist())
      .andExpect(MockMvcResultMatchers.jsonPath("$[1].note").doesNotExist());
  }

  @Test
  void canDeleteTripNote() throws Exception {
    var authorization = this.authTestUtils.generateAuthorizationHeader(this.userAccount);

    var response = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/trip-notes")
          .header(HttpHeaders.AUTHORIZATION, authorization)
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(this.tripNote))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn();

    var noteId = this.objectMapper.readTree(response.getResponse().getContentAsString()).get("id").asText();

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.delete("/api/v1/trip-notes/".concat(noteId))
          .header(HttpHeaders.AUTHORIZATION, authorization)
      )
      .andExpect(MockMvcResultMatchers.status().isOk());
  }

}
