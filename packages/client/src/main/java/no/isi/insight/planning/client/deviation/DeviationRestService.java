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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import no.isi.insight.planning.client.deviation.view.CreateDeviationRequest;
import no.isi.insight.planning.client.deviation.view.DeviationCount;
import no.isi.insight.planning.client.deviation.view.DeviationDetails;

@Validated
@Tag(name = "Deviations", description = "Operations for managing deviations")
@HttpExchange("/api/v1/deviations")
public interface DeviationRestService {

  @GetExchange
  @Operation(summary = "Lists all deviations with optional filtering")
  ResponseEntity<List<DeviationDetails>> listDeviations(
      @RequestParam Optional<UUID> projectId,
      @RequestParam Optional<UUID> planId,
      @RequestParam Optional<UUID> tripId,
      @RequestParam Optional<Long> railingId
  );

  @PostExchange
  @Operation(summary = "Creates a single deviation")
  ResponseEntity<DeviationDetails> createDeviation(
      @RequestBody @Valid CreateDeviationRequest request
  );

  @PostExchange("/batch")
  @Operation(summary = "Creates a batch of deviations")
  ResponseEntity<Void> createDeviations(
      @RequestBody List<@Valid CreateDeviationRequest> request
  );

  @DeleteExchange("/{id}")
  @Operation(summary = "Deletes a deviation from the system")
  ResponseEntity<Void> deleteDeviation(
      @PathVariable UUID id
  );

  @GetExchange("/counts")
  @Operation(summary = "Finds a summary of the deviation counts in the last week")
  ResponseEntity<List<DeviationCount>> getDeviationCounts(
      @RequestParam Optional<UUID> projectId,
      @RequestParam Optional<UUID> planId
  );

}
