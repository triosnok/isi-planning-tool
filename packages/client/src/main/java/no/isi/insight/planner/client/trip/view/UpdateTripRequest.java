package no.isi.insight.planner.client.trip.view;

import java.time.LocalDateTime;
import java.util.Map;

import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record UpdateTripRequest(LocalDateTime endedAt, String gnssLog, Map<CameraPosition, String> cameraLogs) {

}
