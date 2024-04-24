package no.isi.insight.planning.client.railing.view;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.geometry.Geometry;

@Builder
@GenerateTypeScript
public record RoadSegment(
  String id,
  Long railingId,
  String roadReference,
  String roadSystemReference,
  Geometry geometry,
  RoadCategory category,
  double length
) {}
