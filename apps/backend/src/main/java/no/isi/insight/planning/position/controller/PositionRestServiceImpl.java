package no.isi.insight.planning.position.controller;

import java.util.Optional;
import java.util.UUID;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.client.position.PositionRestService;
import no.isi.insight.planning.client.position.view.PositionSubject;
import no.isi.insight.planning.position.model.PositionSubscription;
import no.isi.insight.planning.position.service.PositionService;

@Slf4j
@RestController
@RequiredArgsConstructor
public class PositionRestServiceImpl implements PositionRestService {
  private final PositionService service;

  @Override
  public SseEmitter subscribe(
      Optional<PositionSubject> subject,
      Optional<UUID> subjectId
  ) {
    String error = null;

    if (subject.isPresent() && subjectId.isEmpty()) {
      error = "Subject id is required when subject type is present";
    } else if (subject.isEmpty() && subjectId.isPresent()) {
      error = "Subject type is required when subject id is present";
    }

    if (error != null) {
      var emitter = new SseEmitter();

      try {
        emitter.send(SseEmitter.event().name("error").data(error).build());
      } catch (Exception e) {
        log.warn("Failed to respond with error");
      }

      emitter.complete();

      return emitter;
    }

    var subscription = new PositionSubscription(
      subject,
      subjectId
    );

    return this.service.createEmitter(subscription);
  }

}
