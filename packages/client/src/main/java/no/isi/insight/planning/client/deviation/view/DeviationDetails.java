package no.isi.insight.planning.client.deviation.view;

import java.util.Map;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.geometry.Geometry;

@GenerateTypeScript
public record DeviationDetails(
  String roadSegment,
  Long railingId,
  Geometry position,
  String deviationType,
  Map<String, String> details
) {}
