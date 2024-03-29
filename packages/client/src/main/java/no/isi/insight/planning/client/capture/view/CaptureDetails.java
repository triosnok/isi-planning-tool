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
  Map<CameraPosition, Long> images
) {

  public float getStorageUsage() {
    if (this.totalStorage == 0) {
      return 0;
    }

    return this.usedStorage / this.totalStorage * 100;
  }

}
