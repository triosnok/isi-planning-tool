package no.isi.insight.planner.client.trip.view;

import java.util.UUID;

public record TripDetails(
  UUID id,
  String startedAt,
  String endedAt,
  String gnssLog,
  String cameraLogs
) {
  
}
