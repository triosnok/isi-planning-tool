package no.isi.insight.planning.client.railing;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.project.view.RoadRailing;
import no.isi.insight.planning.client.railing.view.RoadSegment;

@Tag(name = "Railings", description = "Operations on the collection of railings")
@HttpExchange("/api/v1/railings")
public interface RailingRestService {

  @GetExchange
  ResponseEntity<List<RoadRailing>> getRailings(
      @RequestParam Optional<UUID> projectId,
      @RequestParam(required = false) List<UUID> planId,
      @RequestParam Optional<UUID> tripId,
      @RequestParam Optional<Boolean> hideCompleted
  );

  @GetExchange("/{id}/segments")
  ResponseEntity<List<RoadSegment>> getSegments(
      @PathVariable Long id
  );

}
