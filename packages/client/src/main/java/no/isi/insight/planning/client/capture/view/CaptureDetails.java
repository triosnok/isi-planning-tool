package no.isi.insight.planning.client.capture.view;

import java.util.Map;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.geometry.Geometry;
import no.isi.insight.planning.client.trip.view.CameraPosition;

@GenerateTypeScript
public record CaptureDetails(
  long usedStorage,
  long totalStorage,
  Geometry position,
  double heading,
  float gpsSignal,
  boolean activeCapture,
  int metersCaptured,
  Map<CameraPosition, Long> images,
  ImageAnalysis imageAnalysis,
  float storageRemaining
) {}
