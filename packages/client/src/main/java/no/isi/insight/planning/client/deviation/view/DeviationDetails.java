package no.isi.insight.planning.client.deviation.view;

import java.util.Map;
import java.util.UUID;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.geometry.Geometry;

@GenerateTypeScript
public record DeviationDetails(
  String roadSystemReference,
  Long railingId,
  String segmentId,
  UUID captureId,
  Double segmentIndex,
  Geometry position,
  String deviationType,
  Map<String, String> details
) {}
