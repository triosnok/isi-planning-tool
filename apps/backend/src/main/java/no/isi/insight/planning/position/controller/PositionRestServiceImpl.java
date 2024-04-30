package no.isi.insight.planning.position.controller;

import java.util.Optional;
import java.util.UUID;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.client.position.PositionRestService;
import no.isi.insight.planning.client.position.view.PositionSubject;
import no.isi.insight.planning.position.model.PositionSubscription;
import no.isi.insight.planning.position.service.PositionService;

@RestController
@RequiredArgsConstructor
public class PositionRestServiceImpl implements PositionRestService {
  private final PositionService service;

  @Override
  public SseEmitter subscribe(
      PositionSubject subject,
      Optional<UUID> subjectId
  ) {
    var subscription = new PositionSubscription(
      subject,
      subjectId
    );

    return this.service.createEmitter(subscription);
  }

}
