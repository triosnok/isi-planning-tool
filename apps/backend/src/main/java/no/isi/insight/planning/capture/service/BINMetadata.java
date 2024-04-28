package no.isi.insight.planning.capture.service;

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
) {}
