package no.isi.insight.planning.capture.model;

import java.time.LocalDateTime;
import java.util.Map;

import no.isi.insight.planning.client.geometry.Geometry;
import no.isi.insight.planning.client.trip.view.CameraPosition;

public record ProcessedLogEntry(
  Geometry position,
  Double heading,
  LocalDateTime timestamp,
  Map<CameraPosition, String> images
) {}
