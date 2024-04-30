package no.isi.insight.planning.client.railing;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.railing.view.RailingCapture;
import no.isi.insight.planning.client.railing.view.RoadRailing;
import no.isi.insight.planning.client.railing.view.RoadSegment;

@Tag(name = "Railings", description = "Operations on the collection of railings")
@HttpExchange("/api/v1/railings")
public interface RailingRestService {

  /**
   * Finds a list of railings registered railings based on the given criteria.
   * 
   * @param projectId the id of the project to find railings for
   * @param planId    optionally, the id of the plan within a project to find railings for
   * @param tripId    optionally, the id of the trip within a plan to find railings for
   * 
   * @return a list of railings
   */
  @GetExchange
  ResponseEntity<List<RoadRailing>> getRailings(
      @RequestParam Optional<UUID> projectId,
      @RequestParam(required = false) List<UUID> planId,
      @RequestParam Optional<UUID> tripId,
      @RequestParam Optional<Boolean> hideCompleted
  );

  @GetExchange("/{id}")
  ResponseEntity<RoadRailing> getRailing(
      @PathVariable Long id,
      @RequestParam Optional<UUID> projectId
  );

  @GetExchange("/{id}/segments")
  ResponseEntity<List<RoadSegment>> getSegments(
      @PathVariable Long id
  );

  @Operation(
    summary = "Lists captures of a railing",
    description = "Finds the captures of a railing on a given segment using an index within the length of the segment"
  )
  @GetExchange("/{railingId}/{segmentId}/capture")
  ResponseEntity<List<RailingCapture>> listCaptures(
      @PathVariable Long railingId,
      @PathVariable String segmentId,
      @Parameter(
        description = "The index of to find images from on the segments length, should be between 0 and the length of the segment"
      ) @RequestParam double segmentIndex,
      @Parameter(description = "The project id to scope the captures to") @RequestParam Optional<UUID> projectId,
      @Parameter(description = "The project plan id to scope captures to") @RequestParam Optional<UUID> planId,
      @Parameter(description = "The trip id to scope captures to") @RequestParam Optional<UUID> tripId
  );

}
