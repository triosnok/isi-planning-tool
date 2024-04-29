package no.isi.insight.planning.deviation.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.client.deviation.DeviationRestService;
import no.isi.insight.planning.client.deviation.view.CreateDeviationRequest;
import no.isi.insight.planning.client.deviation.view.DeviationCount;
import no.isi.insight.planning.client.deviation.view.DeviationDetails;
import no.isi.insight.planning.db.model.TripRailingDeviation;
import no.isi.insight.planning.db.repository.TripRailingCaptureJpaRepository;
import no.isi.insight.planning.db.repository.TripRailingDeviationJdbcRepository;
import no.isi.insight.planning.db.repository.TripRailingDeviationJpaRepository;
import no.isi.insight.planning.db.utility.DateTrunc;
import no.isi.insight.planning.error.model.BadRequestException;
import no.isi.insight.planning.error.model.NotFoundException;

@RestController
@RequiredArgsConstructor
public class DeviationRestServiceImpl implements DeviationRestService {
  private final TripRailingCaptureJpaRepository captureJpaRepository;
  private final TripRailingDeviationJpaRepository deviationJpaRepository;
  private final TripRailingDeviationJdbcRepository deviationJdbcRepository;

  @Override
  public ResponseEntity<List<DeviationDetails>> listDeviations(
      Optional<UUID> projectId,
      Optional<UUID> planId,
      Optional<UUID> tripId,
      Optional<Long> railingId
  ) {
    var hasFilter = Stream.of(projectId, planId, tripId, railingId).anyMatch(Optional::isPresent);

    if (!hasFilter) {
      throw new BadRequestException("At least one parameter needs to be provided");
    }

    var deviations = this.deviationJdbcRepository
      .findDeviations(Optional.empty(), projectId, planId, tripId, railingId);

    return ResponseEntity.ok(deviations);
  }

  @Override
  public ResponseEntity<DeviationDetails> createDeviation(
      CreateDeviationRequest request
  ) {
    var capture = this.captureJpaRepository.findById(request.captureId())
      .orElseThrow(() -> new NotFoundException("Could not find a capture with id: " + request.captureId()));

    var deviation = new TripRailingDeviation(
      capture,
      request.deviationType(),
      request.details()
    );

    var saved = this.deviationJpaRepository.save(deviation);

    return ResponseEntity.ok(this.deviationJdbcRepository.findById(saved.getId()).get());
  }

  @Override
  public ResponseEntity<Void> createDeviations(
      List<CreateDeviationRequest> request
  ) {
    var captures = this.captureJpaRepository
      .findAllByIds(request.stream().map(req -> req.captureId()).collect(Collectors.toSet()));

    var deviations = request.stream().map(deviation -> {
      var capture = captures.stream().filter(c -> c.getId().equals(deviation.captureId())).findFirst();

      if (capture.isEmpty()) {
        return null;
      }

      return new TripRailingDeviation(
        capture.get(),
        deviation.deviationType(),
        deviation.details()
      );
    }).filter(Objects::nonNull).toList();

    this.deviationJpaRepository.saveAll(deviations);

    return ResponseEntity.created(null).build();
  }

  @Override
  public ResponseEntity<Void> deleteDeviation(
      UUID id
  ) {
    var deviation = this.deviationJpaRepository.findById(id)
      .orElseThrow(() -> new NotFoundException("Could not find a deviation with id: %s".formatted(id)));

    this.deviationJpaRepository.delete(deviation);

    return ResponseEntity.noContent().build();
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<DeviationCount>> getDeviationCounts(
      Optional<UUID> projectId,
      Optional<UUID> planId
  ) {
    var counts = this.deviationJdbcRepository.getDeviationCounts(DateTrunc.WEEK, LocalDate.now(), projectId, planId);
    return ResponseEntity.ok(counts);
  }

}
