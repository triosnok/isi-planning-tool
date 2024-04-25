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
import no.isi.insight.planning.client.railing.view.RoadRailing;
import no.isi.insight.planning.client.railing.view.RoadSegment;
import no.isi.insight.planning.db.repository.RoadRailingJdbcRepository;
import no.isi.insight.planning.db.repository.RoadSegmentJdbcRepository;
import no.isi.insight.planning.error.model.BadRequestException;

@RestController
@RequiredArgsConstructor
public class RailingRestServiceImpl implements RailingRestService {
  private final RoadRailingJdbcRepository jdbcRepository;
  private final RoadSegmentJdbcRepository segmentJdbcRepository;

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

    var railings = this.jdbcRepository.getRailings(projectId, planId, tripId, hideCompleted.orElse(false));
    return ResponseEntity.ok(railings);
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<RoadSegment>> getSegments(
      Long id
  ) {
    var segments = this.segmentJdbcRepository.findByRailingId(id);
    return ResponseEntity.ok(segments);
  }

}
