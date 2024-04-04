package no.isi.insight.planning.project.service;

import org.locationtech.jts.geom.LineString;

import lombok.Builder;
import no.isi.insight.planning.model.RoadDirection;
import no.isi.insight.planning.model.RoadSide;

@Builder
public class RoadSegmentReverser {
  private final RoadDirection roadSystemDirection;
  private final RoadDirection stretchDirection;
  private final RoadDirection placementDirection;
  private final RoadSide placementSide;
  private final LineString stretch;

  /**
   * Helper method for determining whether or not the geometry should be reversed.
   * 
   * @return true if the geometry should be reversed
   */
  private boolean shouldReverseGeometry() {
    var isOpposite = this.stretchDirection == RoadDirection.AGAINST;
    var shouldBeOpposite = this.roadSystemDirection == RoadDirection.AGAINST;

    return isOpposite && !shouldBeOpposite;
  }

  /**
   * Helper method for determining whether or not the side of the placement should be reversed.
   * 
   * @return true if the side should be reversed
   */
  private boolean shouldReverseSide() {
    var isOpposite = this.placementDirection != this.stretchDirection;
    var shouldBeOpposite = this.shouldReverseGeometry();

    return isOpposite && !shouldBeOpposite;
  }

  /**
   * Returns the direction of the road segment according to the road system.
   * 
   * @return the direction of the road segment
   */
  public RoadDirection getDirection() {
    return this.roadSystemDirection;
  }

  /**
   * Returns the geometry of the road segment, reversed to be WITH the road system. It is always WITH
   * to ensure that inferring the driving direction is consistent.
   * 
   * @return the geometry of the road segment
   */
  public LineString getGeometry() {
    if (this.shouldReverseGeometry()) {
      return this.stretch.reverse();
    }

    return this.stretch;
  }

  /**
   * Returns the railings placement on the segment, reversed to be in line with the road system
   * direction.
   * 
   * @return the railings placement on the segment
   */
  public RoadSide getSide() {
    if (this.shouldReverseSide()) {
      return this.placementSide.opposite();
    }

    return this.placementSide;
  }
}
