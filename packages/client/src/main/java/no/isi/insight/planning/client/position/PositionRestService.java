package no.isi.insight.planning.client.position;

import java.util.Optional;
import java.util.UUID;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.position.view.PositionSubject;

@Tag(name = "Positions", description = "Operations for subscribing to the positions of drivers and vehicles")
@HttpExchange("/api/v1/positions")
public interface PositionRestService {

  @Operation(
    summary = "Subscribe to position events, optionally filtered by subject",
    description = "Server-sent events endpoint for subscribing to position events.\nIf a subject type is defined, an id also has to be defined. If none is defined, all known positions will be emitted."
  )
  @GetExchange("/events")
  SseEmitter subscribe(
      @Parameter(description = "The type of subject to subscribe to positions for, must be used with id")
      @RequestParam("subject-type") Optional<PositionSubject> subject,
      @Parameter(description = "The id of the subject to subscribe to positions for, must be used with subject-type")
      @RequestParam("id") Optional<UUID> subjectId
  );

}
