package no.isi.insight.planning.position.model;

import java.util.Optional;
import java.util.UUID;

import no.isi.insight.planning.client.position.view.PositionSubject;

public record PositionSubscription(Optional<PositionSubject> subjectType, Optional<UUID> subjectId) {

  public boolean subscribesTo(
      PositionKey positionKey
  ) {
    if (this.subjectType.isEmpty() || this.subjectId.isEmpty()) {
      return true;
    }

    var id = this.subjectId.get();

    return switch (this.subjectType.get()) {
      case DRIVER -> positionKey.driverId().equals(id);
      case VEHICLE -> positionKey.vehicleId().equals(id);
    };
  }

}
