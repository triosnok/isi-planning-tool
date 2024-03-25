package no.isi.insight.planning.client.trip.view;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Map;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@Builder
@GenerateTypeScript
public record TripDetails(
  UUID id,
  String driver,
  LocalDateTime startedAt,
  LocalDateTime endedAt,
  String gnssLog,
  Map<CameraPosition, String> cameraLogs,
  int sequenceNumber,
  Long noteCount,
  int deviations
) {

}
