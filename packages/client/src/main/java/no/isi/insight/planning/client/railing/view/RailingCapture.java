package no.isi.insight.planning.client.railing.view;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.geometry.Geometry;
import no.isi.insight.planning.client.trip.view.CameraPosition;

@Builder
@GenerateTypeScript
public record RailingCapture(
  UUID id,
  String segmentId,
  long railingId,
  UUID tripId,
  UUID planId,
  UUID projectId,
  Geometry geometry,
  Range segmentCoverage,
  Map<CameraPosition, String> imageUrls,
  LocalDateTime capturedAt
) {}
