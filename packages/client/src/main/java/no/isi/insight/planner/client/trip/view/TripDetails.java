package no.isi.insight.planner.client.trip.view;

import java.time.LocalDateTime;
import java.util.UUID;

public record TripDetails(UUID id, LocalDateTime startedAt, LocalDateTime endedAt, String gnssLog, String cameraLogs) {

}
