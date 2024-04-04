package no.isi.insight.planning.vehicle.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.auth.annotation.PlannerAuthorization;
import no.isi.insight.planning.client.project.view.ProjectPlanDetails;
import no.isi.insight.planning.client.trip.view.TripDetails;
import no.isi.insight.planning.client.vehicle.VehicleRestService;
import no.isi.insight.planning.client.vehicle.view.CreateVehicleRequest;
import no.isi.insight.planning.client.vehicle.view.UpdateVehicleRequest;
import no.isi.insight.planning.client.vehicle.view.VehicleDetails;
import no.isi.insight.planning.error.model.BadRequestException;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.model.Vehicle;
import no.isi.insight.planning.repository.ProjectPlanJdbcRepository;
import no.isi.insight.planning.repository.TripJpaRepository;
import no.isi.insight.planning.repository.VehicleJdbcRepository;
import no.isi.insight.planning.repository.VehicleJpaRepository;

@RestController
@RequiredArgsConstructor
public class VehicleRestServiceImpl implements VehicleRestService {

  private final VehicleJpaRepository vehicleJpaRepository;
  private final VehicleJdbcRepository vehicleJdbcRespotiory;
  private final ProjectPlanJdbcRepository projectPlanJdbcRepository;
  private final TripJpaRepository tripJpaRepository;

  @Override
  @PlannerAuthorization
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
  @PlannerAuthorization
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
  @DriverAuthorization
  public ResponseEntity<VehicleDetails> findVehicle(
      UUID id
  ) {
    var vehicle = this.vehicleJdbcRespotiory.findById(id)
      .orElseThrow(() -> new NotFoundException("Vehicle with id '%s' not found".formatted(id)));

    return ResponseEntity.ok(vehicle);
  }

  @Override
  @DriverAuthorization
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

  @Override
  @DriverAuthorization
  public ResponseEntity<List<ProjectPlanDetails>> findPlansByVehicleId(
      UUID id
  ) {
    var plans = this.projectPlanJdbcRepository.findByVehicleId(id);
    return ResponseEntity.ok(plans);
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<TripDetails>> findTripsByVehicleId(
      UUID id
  ) {
    var trips = this.tripJpaRepository.findAllByVehicleId(id);
    return ResponseEntity.ok(trips);
  }

}
