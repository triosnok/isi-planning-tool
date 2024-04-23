package no.isi.insight.planning.db.model;

/**
 * Represents the direction of a road lane.
 */
public enum RoadDirection {
  WITH,
  AGAINST;

  public RoadDirection opposite() {
    return switch (this) {
      case WITH -> AGAINST;
      case AGAINST -> WITH;
    };
  }

}
