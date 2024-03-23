package no.isi.insight.planning.model;

/**
 * Represents the side of a road.
 */
public enum RoadSide {
  LEFT,
  RIGHT,
  LEFT_AND_RIGHT,
  MIDDLE,
  CROSSING,
  MIDDLE_LEFT,
  MIDDLE_RIGHT,
  LEFT_ACCESS,
  RIGHT_ACCESS,
  ROUNDABOUT_CENTRE,
  LONGITUDINAL;

  /**
   * Returns the opposite side of the road, for sides where a direct opposite exists. Otherwise
   * returns the same side.
   * 
   * @return the opposite side of the road
   */
  public RoadSide opposite() {
    return switch (this) {
      case LEFT -> RIGHT;
      case RIGHT -> LEFT;
      case MIDDLE_LEFT -> MIDDLE_RIGHT;
      case MIDDLE_RIGHT -> MIDDLE_LEFT;
      default -> this;
    };
  }
}
