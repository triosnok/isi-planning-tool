package no.isi.insight.planning.client.trip.view;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@Builder
@GenerateTypeScript
public record TripDetails(
  UUID id,
  UUID projectPlanId,
  UUID projectId,
  String project,
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
