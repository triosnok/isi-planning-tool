package no.isi.insight.planning.railing.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.client.railing.RailingRestService;
import no.isi.insight.planning.client.railing.view.RailingCapture;
import no.isi.insight.planning.client.railing.view.RoadRailing;
import no.isi.insight.planning.client.railing.view.RoadSegment;
import no.isi.insight.planning.db.repository.RoadRailingJdbcRepository;
import no.isi.insight.planning.db.repository.RoadSegmentJdbcRepository;
import no.isi.insight.planning.db.repository.TripRailingCaptureJdbcRepository;
import no.isi.insight.planning.error.model.BadRequestException;
import no.isi.insight.planning.error.model.NotFoundException;

@RestController
@RequiredArgsConstructor
public class RailingRestServiceImpl implements RailingRestService {
  private final RoadRailingJdbcRepository jdbcRepository;
  private final RoadSegmentJdbcRepository segmentJdbcRepository;
  private final TripRailingCaptureJdbcRepository captureJdbcRepository;

  @Override
  @DriverAuthorization
  public ResponseEntity<List<RoadRailing>> getRailings(
      Optional<UUID> projectId,
      List<UUID> planId,
      Optional<UUID> tripId,
      Optional<Boolean> hideCompleted
  ) {
    var validFilters = Stream.of(projectId.isEmpty(), planId != null && planId.isEmpty(), tripId.isEmpty())
      .anyMatch(p -> p != true);

    if (!validFilters) {
      throw new BadRequestException("At least one of the projectId, planId or tripId parameters must be provided");
    }

    var railings = this.jdbcRepository.findAll(projectId, planId, tripId, hideCompleted.orElse(false));
    return ResponseEntity.ok(railings);
  }

  @Override
  public ResponseEntity<RoadRailing> getRailing(
      Long id,
      Optional<UUID> projectId
  ) {
    var railing = this.jdbcRepository.findById(id, projectId)
      .orElseThrow(() -> new NotFoundException("Could not find a railing with id: %s".formatted(id)));

    return ResponseEntity.ok(railing);
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<RoadSegment>> getSegments(
      Long id
  ) {
    var segments = this.segmentJdbcRepository.findByRailingId(id);
    return ResponseEntity.ok(segments);
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<RailingCapture>> listCaptures(
      Long railingId,
      String segmentId,
      double segmentIndex,
      Optional<UUID> projectId,
      Optional<UUID> planId,
      Optional<UUID> tripId
  ) {
    var captures = this.captureJdbcRepository.findAll(railingId, segmentId, segmentIndex, projectId, planId, tripId);
    return ResponseEntity.ok(captures);
  }

}
