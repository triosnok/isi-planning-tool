package no.isi.insight.planning.vehicle;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.dockerjava.zerodep.shaded.org.apache.hc.core5.http.HttpHeaders;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.annotation.IntegrationTest;
import no.isi.insight.planning.auth.service.UserAccountService;
import no.isi.insight.planning.client.vehicle.view.CreateVehicleRequest;
import no.isi.insight.planning.client.vehicle.view.UpdateVehicleRequest;
import no.isi.insight.planning.db.model.UserAccount;
import no.isi.insight.planning.db.model.UserAccountRole;
import no.isi.insight.planning.db.model.Vehicle;
import no.isi.insight.planning.utility.AuthTestUtils;

@IntegrationTest
@RequiredArgsConstructor
class VehicleRestServiceIntegrationTests {

  private final MockMvc mockMvc;
  private final ObjectMapper objectMapper;
  private final UserAccountService userService;
  private final AuthTestUtils authTestUtils;

  private CreateVehicleRequest vehicle;
  private UserAccount userAccount;

  @BeforeEach
  void setup() {
    this.vehicle = new CreateVehicleRequest(
      "http://example.com/image.jpg",
      "AB12345",
      "Tesla Model S",
      true,
      "A car",
      "gnss-123"
    );

    this.userAccount = this.userService
      .createAccount("Planner", "test@invalid.no", "", "pass", UserAccountRole.PLANNER);

  }

  @AfterEach
  void cleanup() {
    this.vehicle = null;

    this.userService.deleteAccount(this.userAccount);
  }

  @Test
  void canCreateVehicle() throws Exception {
    var authorization = this.authTestUtils.generateAuthorizationHeader(this.userAccount);

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/vehicles")
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(this.vehicle))
          .header(HttpHeaders.AUTHORIZATION, authorization)
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$.id").isString())
      .andExpect(MockMvcResultMatchers.jsonPath("$.imageUrl").value(this.vehicle.imageUrl()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.registrationNumber").value(this.vehicle.registrationNumber()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.model").value(this.vehicle.model()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.camera").value(this.vehicle.camera()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.description").value(this.vehicle.description()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.gnssId").value(this.vehicle.gnssId()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.inactiveFrom").doesNotExist());
  }

  @Test
  void canSaveAndUpdateVehicle() throws Exception {
    var authorization = this.authTestUtils.generateAuthorizationHeader(this.userAccount);

    var savedVehicle = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/vehicles")
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(this.vehicle))
          .header(HttpHeaders.AUTHORIZATION, authorization)
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    var vehicleDetails = this.objectMapper.readValue(savedVehicle, Vehicle.class);

    var updateRequest = new UpdateVehicleRequest(
      "http://example.com/image2.jpg",
      "AB12346",
      "Tesla Model 3",
      false,
      "A car",
      "gnss-124",
      null
    );

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.put("/api/v1/vehicles/" + vehicleDetails.getId())
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(updateRequest))
          .header(HttpHeaders.AUTHORIZATION, authorization)
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(vehicleDetails.getId().toString()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.imageUrl").value(updateRequest.imageUrl()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.registrationNumber").value(updateRequest.registrationNumber()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.model").value(updateRequest.model()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.camera").value(updateRequest.camera()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.description").value(updateRequest.description()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.gnssId").value(updateRequest.gnssId()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.inactiveFrom").doesNotExist());
  }

  @Test
  void canSaveAndFindVehicle() throws Exception {
    var authorization = this.authTestUtils.generateAuthorizationHeader(this.userAccount);

    var savedVehicle = this.mockMvc
      .perform(
        MockMvcRequestBuilders.post("/api/v1/vehicles")
          .contentType(MediaType.APPLICATION_JSON)
          .content(this.objectMapper.writeValueAsString(this.vehicle))
          .header(HttpHeaders.AUTHORIZATION, authorization)
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn()
      .getResponse()
      .getContentAsString();

    var vehicleDetails = this.objectMapper.readValue(savedVehicle, Vehicle.class);

    this.mockMvc
      .perform(
        MockMvcRequestBuilders.get("/api/v1/vehicles/" + vehicleDetails.getId())
          .contentType(MediaType.APPLICATION_JSON)
          .header(HttpHeaders.AUTHORIZATION, authorization)
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(vehicleDetails.getId().toString()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.imageUrl").value(vehicleDetails.getImageUrl()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.registrationNumber").value(vehicleDetails.getRegistrationNumber()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.model").value(vehicleDetails.getModel()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.camera").value(vehicleDetails.getCamera()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.description").value(vehicleDetails.getDescription()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.gnssId").value(vehicleDetails.getGnssId()))
      .andExpect(MockMvcResultMatchers.jsonPath("$.inactiveFrom").doesNotExist());
  }

}
