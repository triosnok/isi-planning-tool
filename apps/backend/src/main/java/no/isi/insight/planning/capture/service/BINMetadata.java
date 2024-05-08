package no.isi.insight.planning.capture.service;

import no.isi.insight.planning.capture.model.Ellipsoid;

/**
 * Metadata for a BIN file following the Gravsoft BIN format.
 */
public record BINMetadata(
  double minLat,
  double maxLat,
  double minLon,
  double maxLon,
  double sizeLat,
  double sizeLon,
  int utm,
  int ellipsoid,
  int zone
) {

  public String getBounds() {
    return "Lon:[%s-%s] Lat:[%s-%s]".formatted(this.minLon(), this.maxLon(), this.minLat(), this.maxLat());
  }

  public Ellipsoid getEllipsoid() {
    return Ellipsoid.fromInt(this.ellipsoid());
  }

}
