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
import no.isi.insight.planning.capture.service.CaptureReplayService;
import no.isi.insight.planning.client.trip.TripRestService;
import no.isi.insight.planning.client.trip.view.CreateTripRequest;
import no.isi.insight.planning.client.trip.view.TripDetails;
import no.isi.insight.planning.client.trip.view.UpdateTripRequest;
import no.isi.insight.planning.db.model.ProjectPlan;
import no.isi.insight.planning.db.model.Trip;
import no.isi.insight.planning.db.model.Vehicle;
import no.isi.insight.planning.db.repository.ProjectPlanJpaRepository;
import no.isi.insight.planning.db.repository.TripJdbcRepository;
import no.isi.insight.planning.db.repository.TripJpaRepository;
import no.isi.insight.planning.db.repository.VehicleJpaRepository;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.trip.event.TripEndedEvent;
import no.isi.insight.planning.trip.event.TripStartedEvent;
import no.isi.insight.planning.utility.RequestUtils;

@RestController
@RequiredArgsConstructor
public class TripRestServiceImpl implements TripRestService {
  private final TripJpaRepository tripJpaRepository;
  private final TripJdbcRepository tripJdbcRepository;
  private final ProjectPlanJpaRepository planJpaRepository;
  private final VehicleJpaRepository vehicleJpaRepository;
  private final ApplicationEventPublisher eventPublisher;
  private final CaptureReplayService captureReplayService;

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
        savedTrip.getProjectPlan().getProject().getId(),
        savedTrip.getProjectPlan().getId(),
        savedTrip.getProjectPlan().getProject().getName(),
        savedTrip.getDriver().getFullName(),
        savedTrip.getStartedAt(),
        savedTrip.getEndedAt(),
        savedTrip.getSequenceNumber(),
        Long.valueOf(0),
        0,
        null
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
        trip.getProjectPlan().getId(),
        trip.getProjectPlan().getProject().getId(),
        trip.getProjectPlan().getProject().getName(),
        trip.getDriver().getFullName(),
        trip.getStartedAt(),
        trip.getEndedAt(),
        trip.getSequenceNumber(),
        noteCount,
        0,
        trip.getCaptureDetails()
      )
    );
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<TripDetails>> getTrips(
      Optional<UUID> projectId,
      Optional<List<UUID>> planId,
      Optional<Boolean> active
  ) {
    var trips = tripJdbcRepository.findAll(projectId, planId.orElse(null), active);

    return ResponseEntity.ok(trips);
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<TripDetails> updateTrip(
      UUID tripId,
      UpdateTripRequest request
  ) {
    Trip trip = tripJpaRepository.findById(tripId).orElseThrow(() -> new NotFoundException("Trip not found"));
    var captureDetails = this.captureReplayService.getCurrentCaptureDetails(tripId);

    trip.setCaptureDetails(captureDetails.orElse(null));
    trip.setEndedAt(LocalDateTime.now());
    trip.setGnssLog(request.gnssLog());
    trip.setCameraLogs(request.cameraLogs());

    Trip savedTrip = tripJpaRepository.save(trip);

    this.eventPublisher.publishEvent(new TripEndedEvent(tripId));

    var noteCount = tripJpaRepository.countTripNotesByTripId(trip.getId());

    return ResponseEntity.ok(
      new TripDetails(
        savedTrip.getId(),
        savedTrip.getProjectPlan().getId(),
        savedTrip.getProjectPlan().getProject().getId(),
        savedTrip.getProjectPlan().getProject().getName(),
        savedTrip.getDriver().getFullName(),
        savedTrip.getStartedAt(),
        savedTrip.getEndedAt(),
        savedTrip.getSequenceNumber(),
        noteCount,
        0,
        savedTrip.getCaptureDetails()
      )
    );
  }

}
