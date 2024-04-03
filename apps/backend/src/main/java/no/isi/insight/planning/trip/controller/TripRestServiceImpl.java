package no.isi.insight.planning.trip.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.client.trip.TripRestService;
import no.isi.insight.planning.client.trip.view.CreateTripRequest;
import no.isi.insight.planning.client.trip.view.TripDetails;
import no.isi.insight.planning.client.trip.view.UpdateTripRequest;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.model.ProjectPlan;
import no.isi.insight.planning.model.Trip;
import no.isi.insight.planning.model.Vehicle;
import no.isi.insight.planning.repository.ProjectPlanJpaRepository;
import no.isi.insight.planning.repository.TripJpaRepository;
import no.isi.insight.planning.repository.VehicleJpaRepository;
import no.isi.insight.planning.trip.event.TripEndedEvent;
import no.isi.insight.planning.trip.event.TripStartedEvent;
import no.isi.insight.planning.utility.RequestUtils;

@RestController
@RequiredArgsConstructor
public class TripRestServiceImpl implements TripRestService {
  private final TripJpaRepository tripJpaRepository;
  private final ProjectPlanJpaRepository planJpaRepository;
  private final VehicleJpaRepository vehicleJpaRepository;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  @DriverAuthorization
  public ResponseEntity<TripDetails> createTrip(
      CreateTripRequest request
  ) {

    ProjectPlan plan = planJpaRepository.findById(request.planId())
      .orElseThrow(() -> new NotFoundException("Plan not found"));

    Vehicle vehicle = vehicleJpaRepository.findById(request.vehicleId())
      .orElseThrow(() -> new NotFoundException("Vehicle not found"));

    var userAccount = RequestUtils.getRequestingUserAccount()
      .orElseThrow(() -> new NotFoundException("User not found"));

    var sequenceNumber = tripJpaRepository.findNextSequenceNumber(plan.getProject().getId());

    Trip trip = new Trip(
      vehicle,
      userAccount,
      plan,
      LocalDateTime.now(),
      sequenceNumber
    );

    Trip savedTrip = tripJpaRepository.save(trip);

    this.eventPublisher.publishEvent(
      new TripStartedEvent(
        savedTrip,
        request.captureLogId(),
        request.replaySpeed()
      )
    );

    return ResponseEntity.ok(
      new TripDetails(
        savedTrip.getId(),
        savedTrip.getDriver().getFullName(),
        savedTrip.getStartedAt(),
        savedTrip.getEndedAt(),
        savedTrip.getGnssLog(),
        savedTrip.getCameraLogs(),
        savedTrip.getSequenceNumber(),
        Long.valueOf(0),
        0
      )
    );
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<TripDetails> getTrip(
      UUID tripId
  ) {

    Trip trip = tripJpaRepository.findById(tripId).orElseThrow(() -> new NotFoundException("Trip not found"));

    var noteCount = tripJpaRepository.countTripNotesByTripId(trip.getId());

    return ResponseEntity.ok(
      new TripDetails(
        trip.getId(),
        trip.getDriver().getFullName(),
        trip.getStartedAt(),
        trip.getEndedAt(),
        trip.getGnssLog(),
        trip.getCameraLogs(),
        trip.getSequenceNumber(),
        noteCount,
        0
      )
    );
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<TripDetails>> getTrips(
      UUID projectId,
      Optional<List<UUID>> planId
  ) {
    var trips = tripJpaRepository.findAllByProjectId(projectId, planId.orElse(null));

    return ResponseEntity.ok(trips);
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<TripDetails> updateTrip(
      UUID tripId,
      UpdateTripRequest request
  ) {
    Trip trip = tripJpaRepository.findById(tripId).orElseThrow(() -> new NotFoundException("Trip not found"));

    trip.setEndedAt(request.endedAt());
    trip.setGnssLog(request.gnssLog());
    trip.setCameraLogs(request.cameraLogs());

    Trip savedTrip = tripJpaRepository.save(trip);

    this.eventPublisher.publishEvent(new TripEndedEvent(tripId));

    var noteCount = tripJpaRepository.countTripNotesByTripId(trip.getId());

    return ResponseEntity.ok(
      new TripDetails(
        savedTrip.getId(),
        savedTrip.getDriver().getFullName(),
        savedTrip.getStartedAt(),
        savedTrip.getEndedAt(),
        savedTrip.getGnssLog(),
        savedTrip.getCameraLogs(),
        savedTrip.getSequenceNumber(),
        noteCount,
        0
      )
    );
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<TripDetails>> getTripsByVehicleId(
      UUID vehicleId
  ) {
    List<TripDetails> trips = tripJpaRepository.findAllByVehicleId(vehicleId);
    return ResponseEntity.ok(trips);
  }

}
