package no.isi.insight.planning.project.service;

import java.util.List;

import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.linearref.LengthIndexedLine;

import no.isi.insight.planning.model.RoadDirection;

/**
 * Responsible for checking whether or not railings and their related segments have correctly
 * ordered geometries.
 */
public class RailingGeometryOrderChecker<T> {
  private final LineString railing;
  private final List<RoadSegmentReverser<T>> segments;

  private boolean flipped;

  private static final int SEGMENT_SAMPLE_SIZE = 10;
  private static final double FLIPPED_THRESHOLD = 0.75;

  public RailingGeometryOrderChecker(
      LineString railing,
      List<RoadSegmentReverser<T>> segments
  ) {
    this.railing = railing;
    this.segments = segments;
    this.flipped = false;

    this.check();
  }

  private void check() {
    var indexedRailing = new LengthIndexedLine(this.railing);
    var railingEnd = indexedRailing.getEndIndex();
    var flippedCount = 0;

    for (var segment : this.segments) {
      var indexedSegment = new LengthIndexedLine(segment.getGeometry());
      var direction = segment.getDirection();
      var segmentEnd = indexedSegment.getEndIndex();
      var partLength = segmentEnd / SEGMENT_SAMPLE_SIZE;
      var inSameDirection = 0;

      for (int i = 0; i < SEGMENT_SAMPLE_SIZE - 1; i++) {
        var current = indexedSegment.extractPoint(i * partLength);
        var next = indexedSegment.extractPoint((i + 1) * partLength);

        var nearestCurrent = indexedRailing.extractPoint(indexedRailing.project(current));
        var nearestNext = indexedRailing
          .extractPoint(Math.min(indexedRailing.project(current) + partLength, railingEnd));

        var segmentDeg = Math.toDegrees(Math.atan2(next.y - current.y, next.x - current.x));
        var railingDeg = Math.toDegrees(Math.atan2(nearestNext.y - nearestCurrent.y, nearestNext.x - nearestCurrent.x));

        var delta = Math.abs(segmentDeg - railingDeg);

        if ((delta < 180 && direction == RoadDirection.WITH) || (delta >= 180 && direction == RoadDirection.AGAINST)) {
          inSameDirection++;
        }
      }

      var fractionInSameDirection = (double) inSameDirection / (SEGMENT_SAMPLE_SIZE - 1);

      if (fractionInSameDirection < (1 - FLIPPED_THRESHOLD)) {
        flippedCount++;
      }
    }

    this.flipped = flippedCount == this.segments.size();
  }

  public boolean isFlipped() {
    return this.flipped;
  }

  public LineString getGeometry() {
    return this.flipped ? this.railing.reverse() : this.railing;
  }

}
