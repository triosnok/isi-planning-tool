package no.isi.insight.planning.client.railing.view;

import java.time.LocalDateTime;
import java.util.List;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.annotation.Optional;
import no.isi.insight.planning.client.geometry.Geometry;

@GenerateTypeScript
public record RoadRailing(
  Long id,
  Geometry geometry,
  double length,
  double captureGrade,
  @Optional LocalDateTime capturedAt,
  List<RailingRoadSegments> segments
) {}
