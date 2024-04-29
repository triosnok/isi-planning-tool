package no.isi.insight.planning.client.deviation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import no.isi.insight.planning.client.deviation.view.CreateDeviationRequest;
import no.isi.insight.planning.client.deviation.view.DeviationCount;
import no.isi.insight.planning.client.deviation.view.DeviationDetails;

@Validated
@Tag(name = "Deviations")
@HttpExchange("/api/v1/deviations")
public interface DeviationRestService {

  @GetExchange
  ResponseEntity<List<DeviationDetails>> listDeviations(
      @RequestParam Optional<UUID> projectId,
      @RequestParam Optional<UUID> planId,
      @RequestParam Optional<UUID> tripId,
      @RequestParam Optional<Long> railingId
  );

  @PostExchange
  ResponseEntity<DeviationDetails> createDeviation(
      @RequestBody @Valid CreateDeviationRequest request
  );

  @PostExchange("/batch")
  ResponseEntity<Void> createDeviations(
      @RequestBody List<@Valid CreateDeviationRequest> request
  );

  @DeleteExchange("/{id}")
  ResponseEntity<Void> deleteDeviation(
      @PathVariable UUID id
  );

  @GetExchange("/counts")
  ResponseEntity<List<DeviationCount>> getDeviationCounts(
      @RequestParam Optional<UUID> projectId,
      @RequestParam Optional<UUID> planId
  );

}
