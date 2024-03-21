package no.isi.insight.planning.vehicle.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.vehicle.VehicleRestService;
import no.isi.insight.planner.client.vehicle.view.CreateVehicleRequest;
import no.isi.insight.planner.client.vehicle.view.UpdateVehicleRequest;
import no.isi.insight.planner.client.vehicle.view.VehicleDetails;
import no.isi.insight.planning.model.Vehicle;
import no.isi.insight.planning.repository.VehicleJdbcRespotiory;
import no.isi.insight.planning.repository.VehicleJpaRepository;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.error.model.BadRequestException;

@RestController
@RequiredArgsConstructor
public class VehicleRestServiceImpl implements VehicleRestService {

  private final VehicleJpaRepository vehicleJpaRepository;
  private final VehicleJdbcRespotiory vehicleJdbcRespotiory;

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
        savedVehicle.getGnssId(),
        true,
        savedVehicle.getInactiveFrom()
      )
    );
  }

  @Override
  public ResponseEntity<VehicleDetails> updateVehicle(
      UUID id,
      UpdateVehicleRequest request
  ) {
    var vehicle = this.vehicleJpaRepository.findById(id)
      .orElseThrow(() -> new NotFoundException("Vehicle with id '%s' not found".formatted(id)));

    vehicle.setImageUrl(request.imageUrl());
    vehicle.setRegistrationNumber(request.registrationNumber());
    vehicle.setCamera(request.camera());
    vehicle.setModel(request.model());
    vehicle.setDescription(request.description());
    vehicle.setGnssId(request.gnssId());
    vehicle.setInactiveFrom(request.inactiveFrom());

    this.vehicleJpaRepository.save(vehicle);
    var updatedVehicle = this.vehicleJdbcRespotiory.findById(id).get();

    return ResponseEntity.ok(updatedVehicle);
  }

  @Override
  public ResponseEntity<VehicleDetails> findVehicle(
      UUID id
  ) {
    var vehicle = this.vehicleJdbcRespotiory.findById(id)
      .orElseThrow(() -> new NotFoundException("Vehicle with id '%s' not found".formatted(id)));

    return ResponseEntity.ok(vehicle);
  }

  @Override
  public ResponseEntity<List<VehicleDetails>> findAllVehicles(
      Optional<LocalDate> availableFrom,
      Optional<LocalDate> availableTo
  ) {
    var presentDateFilters = Stream.of(availableFrom, availableTo).filter(Optional::isPresent).count();

    if (presentDateFilters == 1 && availableFrom.isEmpty()) {
      throw new BadRequestException("Request parameter 'availableFrom' is required when using 'availableTo'");
    }

    var vehicles = this.vehicleJdbcRespotiory.findVehicles(availableFrom, availableTo);
    return ResponseEntity.ok(vehicles);
  }

}
