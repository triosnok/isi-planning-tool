package no.isi.insight.planning.position.model;

import java.util.Optional;
import java.util.UUID;

import no.isi.insight.planning.client.position.view.PositionSubject;

public record PositionSubscription(PositionSubject subjectType, Optional<UUID> subjectId) {

  public boolean subscribesTo(
      PositionKey positionKey
  ) {
    var idMatches = this.subjectId.filter(id -> id.equals(positionKey.subjectId())).isPresent();
    return switch (this.subjectType) {
      case DRIVER -> positionKey.subject().equals(PositionSubject.DRIVER) && (this.subjectId.isEmpty() || idMatches);
      case VEHICLE -> positionKey.subject().equals(PositionSubject.VEHICLE) && (this.subjectId.isEmpty() || idMatches);
    };
  }

}
