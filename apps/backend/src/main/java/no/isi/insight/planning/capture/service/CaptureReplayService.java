package no.isi.insight.planning.capture.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.locationtech.jts.geom.Point;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.capture.event.CaptureDetailsEvent;
import no.isi.insight.planning.capture.model.ProcessedLogEntry;
import no.isi.insight.planning.client.capture.view.CaptureDetails;
import no.isi.insight.planning.client.trip.view.CameraPosition;
import no.isi.insight.planning.db.model.Trip;
import no.isi.insight.planning.db.model.TripRailingCapture;
import no.isi.insight.planning.db.repository.RoadRailingJpaRepository;
import no.isi.insight.planning.db.repository.TripRailingCaptureJpaRepository;
import no.isi.insight.planning.geometry.GeometryService;
import no.isi.insight.planning.trip.event.TripEndedEvent;
import no.isi.insight.planning.trip.event.TripStartedEvent;

/**
 * Service for replaying captures. Manages the emitters and replays for trips.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CaptureReplayService {
  private final CaptureReplayFileService fileService;
  private final TripRailingCaptureJpaRepository railingCaptureJpaRepository;
  private final RoadRailingJpaRepository roadRailingJpaRepository;
  private final GeometryService geometryService;
  private final ApplicationEventPublisher eventPublisher;
  private final Map<UUID, List<SseEmitter>> emitters = new HashMap<>();
  private final Map<UUID, CaptureLogReplay> replays = new HashMap<>();
  private final ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor();
  private final ImageAnalysisService imageAnalysisService;

  /**
   * Creates a new emitter for a given trips capture.
   * 
   * @param tripId the trip to create the emitter for
   * 
   * @return the emitter
   */
  public SseEmitter createEmitter(
      UUID tripId
  ) {
    var emitter = new SseEmitter(Long.MAX_VALUE);

    emitter.onCompletion(() -> {
      if (this.emitters.containsKey(tripId)) {
        this.emitters.get(tripId).remove(emitter);
      }
    });

    this.emitters.computeIfAbsent(tripId, k -> new ArrayList<>()).add(emitter);

    return emitter;
  }

  /**
   * Starts replaying a given trip.
   * 
   * @param trip       the trip to replay
   * @param logEntries the log entries to replay
   * @param speed      the speed to replay the log at
   */
  private void startReplay(
      Trip trip,
      List<ProcessedLogEntry> logEntries,
      Optional<Integer> speed
  ) {
    var tripId = trip.getId();
    var railings = this.roadRailingJpaRepository.findAllByTripIdEager(tripId);
    var matcher = new CaptureRailingMatcher(
      railings,
      this.geometryService,
      4
    );

    var replay = new CaptureLogReplay(
      logEntries,
      speed.orElse(1),
      (logEntry, logReplay) -> {
        if (logEntry.images().size() == 0) {
          return;
        }

        var gpsPoint = this.geometryService.parsePoint(logEntry.position().wkt());
        var point = this.geometryService.transformGpsToRail(gpsPoint.get());
        point.setSRID(25833);

        var matches = matcher.matchRailings(point, logEntry.heading());

        this.eventPublisher.publishEvent(
          new CaptureDetailsEvent(
            trip,
            logReplay.getCaptureDetails()
          )
        );

        if (matches.isEmpty()) {
          return;
        }

        var captures = new ArrayList<TripRailingCapture>();

        for (var match : matches) {
          var side = match.side();
          var isValidMatch = switch (side) {
            case LEFT ->
              logEntry.images().containsKey(CameraPosition.TOP) || logEntry.images().containsKey(CameraPosition.LEFT);
            case RIGHT ->
              logEntry.images().containsKey(CameraPosition.TOP) || logEntry.images().containsKey(CameraPosition.RIGHT);
            default -> true;
          };

          if (!isValidMatch) {
            return;
          }

          logReplay.incrementMetersCaptured();
          // TODO: Transform geoid height to MSL to allow for proper Z values
          point.getCoordinate().setZ(1.0);

          var capture = new TripRailingCapture(
            trip,
            match.roadSegment(),
            logEntry.timestamp(),
            point,
            logEntry.images(),
            match.segmentIndex(),
            match.railingTopCoverage(),
            match.railingSideCoverage(),
            match.segmentCoverage()
          );

          captures.add(capture);
        }

        this.railingCaptureJpaRepository.saveAll(captures);
      },
      this.imageAnalysisService
    );

    this.replays.put(tripId, replay);

    log.info("Starting replay for trip id {}", tripId);

    // continuously replay the log until the
    // replay is removed (trip stopped), or the replay finishes
    this.executorService.submit(() -> {
      while (this.replays.containsKey(tripId)) {
        try {
          if (!replay.finished()) {
            replay.replaySecond();
          }

          var cd = replay.getCaptureDetails();

          if (cd.isPresent() && this.emitters.containsKey(tripId)) {
            var event = SseEmitter.event()
              .id(UUID.randomUUID().toString())
              .name("message")
              .data(cd.get(), MediaType.APPLICATION_JSON)
              .build();

            for (var emitter : this.emitters.get(tripId)) {
              emitter.send(event);
            }
          }

          if (replay.finished()) {
            this.stopReplay(tripId);
            log.info("Finished replay for trip: {}", tripId);
            break;
          }

          Thread.sleep(1000L);
        } catch (IOException e) {
          // occurs frequently in normal operation, thus ignored
        } catch (InterruptedException e) {
          // also occurs frequently
        } catch (Exception e) {
          // TODO: figure out which exceptions can be ignored (if any)
        }
      }
    });
  }

  /**
   * Gets the current capture details for a trip. Note that a trip has to be active, thus has to be
   * done before ending a trip.
   * 
   * @param tripId the id of the trip
   * 
   * @return the capture details, if available
   */
  public Optional<CaptureDetails> getCurrentCaptureDetails(
      UUID tripId
  ) {
    var replay = this.replays.get(tripId);

    if (replay == null) {
      return Optional.empty();
    }

    return replay.getCaptureDetails();
  }

  /**
   * Gets the current position of a trip.
   * 
   * @param tripId the id of the trip
   * 
   * @return the current position, if available
   */
  public Optional<Point> getCurrentPosition(
      UUID tripId
  ) {
    return this.getCurrentCaptureDetails(tripId)
      .map(CaptureDetails::position)
      .map(geom -> this.geometryService.parsePoint(geom.wkt()).get());
  }

  /**
   * Gets the capture details for a given trip.
   * 
   * @param tripId the trip to get the capture details for
   * 
   * @return the capture details, if available
   */
  public boolean hasTrip(
      UUID tripId
  ) {
    return this.replays.containsKey(tripId);
  }

  /**
   * Resumse the replay of a given trip.
   * 
   * @param tripId id of the trip to resume the replay for
   */
  public void resumeReplay(
      UUID tripId
  ) {
    this.replays.get(tripId).resume();
  }

  /**
   * Pauses the replay of a given trip.
   * 
   * @param tripId id of the trip to pause the replay for
   */
  public void pauseReplay(
      UUID tripId
  ) {
    this.replays.get(tripId).pause();
  }

  /**
   * Stops the replay of a given trip.
   * 
   * @param tripId id of the trip to stop the replay for
   */
  private void stopReplay(
      UUID tripId
  ) {
    if (this.emitters.containsKey(tripId)) {
      this.emitters.get(tripId).forEach(SseEmitter::complete);
      this.emitters.remove(tripId);
    }

    if (this.replays.containsKey(tripId)) {
      this.replays.remove(tripId);
    }
  }

  /**
   * Handles the trip started event.
   * 
   * @param event the trip started event
   */
  @EventListener(TripStartedEvent.class)
  private void onTripStart(
      TripStartedEvent event
  ) {
    if (event.captureLogId() == null) {
      return;
    }

    var logEntries = this.fileService.getCapture(event.captureLogId());
    var speed = Optional.ofNullable(event.replaySpeed());

    this.startReplay(event.trip(), logEntries, speed);
  }

  /**
   * Handles the trip ended event.
   * 
   * @param event the trip ended event
   */
  @EventListener(TripEndedEvent.class)
  private void onTripEnd(
      TripEndedEvent event
  ) {
    this.stopReplay(event.tripId());
  }

}
