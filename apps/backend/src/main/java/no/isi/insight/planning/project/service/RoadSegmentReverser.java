package no.isi.insight.planning.project.service;

import org.locationtech.jts.geom.LineString;

import lombok.Builder;
import no.isi.insight.planning.model.RoadDirection;
import no.isi.insight.planning.model.RoadSide;

@Builder
public class RoadSegmentReverser<T> {
  private final RoadDirection roadSystemDirection;
  private final RoadDirection stretchDirection;
  private final RoadDirection placementDirection;
  private final RoadSide placementSide;
  private final LineString stretch;
  private final T data;

  /**
   * Returns data associated with the reverser.
   * 
   * @return data associated with the reverser
   */
  public T getData() {
    return data;
  }

  /**
   * Returns the direction of the road segment according to the road system.
   * 
   * @return the direction of the road segment
   */
  public RoadDirection getDirection() {
    return this.placementDirection;
  }

  /**
   * Returns the geometry of the road segment.
   * 
   * @return the geometry of the road segment
   */
  public LineString getGeometry() {
    return this.stretch;
  }

  /**
   * Returns the railings placement on the segment.
   * 
   * @return the railings placement on the segment
   */
  public RoadSide getSide() {
    return this.placementSide;
  }

  @Override
  public String toString() {
    return "RoadSegmentReverser[directions=%s-%s-%s,side=%s]"
      .formatted(this.placementDirection, this.stretchDirection, this.roadSystemDirection, this.placementSide);
  }

}
