package no.isi.insight.planning.capture.model;

import java.time.LocalDateTime;
import java.util.Map;

import org.locationtech.jts.geom.Point;

import no.isi.insight.planner.client.trip.view.CameraPosition;

public record ProcessedLogEntry(
  Point point,
  Double heading,
  LocalDateTime timestamp,
  Map<CameraPosition, String> images
) {}
