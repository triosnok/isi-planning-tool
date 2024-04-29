package no.isi.insight.planning.capture.model;

public enum Ellipsoid {
  LAT_LON,
  WGS84,
  HAYFORD,
  CLARKE;

  public static Ellipsoid fromInt(
      int value
  ) {
    return switch (value) {
      case 0 -> LAT_LON;
      case 1 -> WGS84;
      case 2 -> HAYFORD;
      case 3 -> CLARKE;
      default -> throw new IllegalArgumentException("Unknown ellipsoid value: %s".formatted(value));
    };
  }
}
