package no.isi.insight.planning.trip.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.trip.TripRestService;
import no.isi.insight.planner.client.trip.view.CreateTripRequest;
import no.isi.insight.planner.client.trip.view.TripDetails;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.model.ProjectPlan;
import no.isi.insight.planning.model.Trip;
import no.isi.insight.planning.model.Vehicle;
import no.isi.insight.planning.repository.ProjectPlanJpaRepository;
import no.isi.insight.planning.repository.TripJpaRepository;
import no.isi.insight.planning.repository.VehicleJpaRepository;
import no.isi.insight.planning.utility.RequestUtils;

@RestController
@RequiredArgsConstructor
public class TripRestServiceImpl implements TripRestService {
  private final TripJpaRepository tripJpaRepository;
  private final ProjectPlanJpaRepository planJpaRepository;
  private final VehicleJpaRepository vehicleJpaRepository;

  @Override
  @DriverAuthorization
  public ResponseEntity<TripDetails> createTrip(
      UUID projectId,
      UUID planId,
      CreateTripRequest request
  ) {

    ProjectPlan plan = planJpaRepository.findById(planId).orElseThrow(() -> new NotFoundException("Plan not found"));

    Vehicle vehicle = vehicleJpaRepository.findById(request.vehicleId())
      .orElseThrow(() -> new NotFoundException("Vehicle not found"));

    var userAccount = RequestUtils.getRequestingUserAccount()
      .orElseThrow(() -> new NotFoundException("User not found"));

    Trip trip = new Trip();
    trip.setDriverUser(userAccount);
    trip.setProjectPlan(plan);
    trip.setVehicle(vehicle);
    trip.setStartedAt(LocalDateTime.now());

    Trip savedTrip = tripJpaRepository.save(trip);

    return ResponseEntity.ok(
      new TripDetails(
        savedTrip.getId(),
        savedTrip.getStartedAt(),
        null,
        null,
        null
      )
    );
  }
}
