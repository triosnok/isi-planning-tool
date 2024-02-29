package no.isi.insight.planning.vehicle.controller;

import java.util.UUID;

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

  @Override
  public ResponseEntity<VehicleDetails> createVehicle(
      CreateVehicleRequest request
  ) {
    Vehicle vehicle = new Vehicle(
      request.imageUrl(),
      request.registrationNumber(),
      request.model(),
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
        savedVehicle.getModel(),
        savedVehicle.getCamera(),
        savedVehicle.getDescription(),
        savedVehicle.getGnssId()
      )
    );
  }

  @Override
  public ResponseEntity<VehicleDetails> updateVehicle(
      UUID id,
      CreateVehicleRequest request
  ) {
    var vehicle = this.vehicleJpaRepository.findById(id);

    if (vehicle.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    var updatedVehicle = vehicle.get();
    updatedVehicle.setImageUrl(request.imageUrl());
    updatedVehicle.setRegistrationNumber(request.registrationNumber());
    updatedVehicle.setCamera(request.camera());
    updatedVehicle.setModel(request.model());
    updatedVehicle.setDescription(request.description());
    updatedVehicle.setGnssId(request.gnssId());

    var savedVehicle = this.vehicleJpaRepository.save(updatedVehicle);

    return ResponseEntity.ok(
      new VehicleDetails(
        savedVehicle.getId(),
        savedVehicle.getImageUrl(),
        savedVehicle.getRegistrationNumber(),
        savedVehicle.getModel(),
        savedVehicle.getCamera(),
        savedVehicle.getDescription(),
        savedVehicle.getGnssId()
      )
    );
  }

}
