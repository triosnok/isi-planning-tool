package no.isi.insight.planning.vehicle.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.vehicle.VehicleRestService;
import no.isi.insight.planner.client.vehicle.view.CreateVehicleRequest;
import no.isi.insight.planner.client.vehicle.view.VehicleDetails;
import no.isi.insight.planning.model.Vehicle;
import no.isi.insight.planning.repository.VehicleJpaRepository;

@RestController
@RequiredArgsConstructor
public class VehicleRestServiceImpl implements VehicleRestService {

  private final VehicleJpaRepository vehicleJpaRepository;

  /**
   * Creates a new vehicle.
   * 
   * @return
   */
  @Override
  public ResponseEntity<VehicleDetails> createVehicle(
      CreateVehicleRequest request
  ) {
    Vehicle vehicle = new Vehicle(
      request.imageUrl(),
      request.registrationNumber(),
      request.camera(),
      request.description(),
      request.gnssId()
    );

    var savedVehicle = this.vehicleJpaRepository.save(vehicle);

    return ResponseEntity.ok(
      new VehicleDetails(
        savedVehicle.getId(),
        savedVehicle.getImageUrl(),
        savedVehicle.getRegistrationNumber(),
        savedVehicle.getCamera(),
        savedVehicle.getDescription(),
        savedVehicle.getGnssId()
      )
    );
  }
}
