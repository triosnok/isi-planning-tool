package no.isi.insight.planning.repository;

import static org.junit.Assert.assertEquals;

import org.junit.jupiter.api.Test;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.annotation.IntegrationTest;
import no.isi.insight.planning.model.Vehicle;

@IntegrationTest
@RequiredArgsConstructor
class VehicleJpaRepositoryTests {

  private final VehicleJpaRepository vehicleJpaRepository;

  @Test
  void canSaveAndFindVehicle() {
    var newVehicle = new Vehicle(
      "https://picsum.photos/300/200",
      "REF2349239",
      "Model 1",
      true,
      "Vehicle 1",
      "9345-534959-3495"
    );

    var savedVehicle = vehicleJpaRepository.save(newVehicle);

    assertEquals(newVehicle, savedVehicle);
    assertEquals(newVehicle.getId(), savedVehicle.getId());
    assertEquals(newVehicle.getRegistrationNumber(), savedVehicle.getRegistrationNumber());

    var foundVehicle = vehicleJpaRepository.findById(savedVehicle.getId())
      .orElseThrow(() -> new RuntimeException("Vehicle not found"));

    assertEquals(savedVehicle.getId(), foundVehicle.getId());
    assertEquals(savedVehicle.getRegistrationNumber(), foundVehicle.getRegistrationNumber());
    assertEquals(savedVehicle.getGnssId(), foundVehicle.getGnssId());

  }
}
