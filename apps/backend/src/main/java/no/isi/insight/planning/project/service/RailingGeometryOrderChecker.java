package no.isi.insight.planning.project.service;

import java.util.List;

import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.linearref.LengthIndexedLine;

/**
 * Responsible for checking whether or not railings and their related segments have correctly
 * ordered geometries.
 */
public class RailingGeometryOrderChecker {
  private final LineString railing;
  private final List<RoadSegmentReverser> segments;

  private boolean isFlipped;

  private static final int SEGMENT_SAMPLE_SIZE = 40;

  public RailingGeometryOrderChecker(
      LineString railing,
      List<RoadSegmentReverser> segments
  ) {
    this.railing = railing;
    this.segments = segments;
    this.isFlipped = false;

    this.check();
  }

  private void check() {
    var indexedRailing = new LengthIndexedLine(this.railing);
    var flippedCount = 0;

    for (var segment : this.segments) {
      var indexedSegment = new LengthIndexedLine(segment.getGeometry());
      var segmentEnd = indexedSegment.getEndIndex();
      var segmentLength = segmentEnd / SEGMENT_SAMPLE_SIZE;
      var inSameDirection = 0;

      for (int i = 0; i < SEGMENT_SAMPLE_SIZE - 1; i++) {
        var current = indexedSegment.extractPoint(i * segmentLength);
        var next = indexedSegment.extractPoint((i + 1) * segmentLength);

        var nearestCurrent = indexedRailing.extractPoint(indexedRailing.project(current));
        var nearestNext = indexedRailing.extractPoint(indexedRailing.project(next));

        var segmentDeg = Math.toDegrees(Math.atan2(next.y - current.y, next.x - current.y));
        var railingDeg = Math.toDegrees(Math.atan2(nearestNext.y - nearestCurrent.y, nearestNext.x - nearestCurrent.x));

        if (Math.abs(segmentDeg - railingDeg) < 180) {
          inSameDirection++;
        }
      }

      var fractionInSameDirection = inSameDirection / SEGMENT_SAMPLE_SIZE - 1;

      if (fractionInSameDirection < 0.10) {
        flippedCount++;
      }
    }

    this.isFlipped = flippedCount == this.segments.size();
  }

  public LineString getGeometry() {
    return this.isFlipped ? this.railing.reverse() : this.railing;
  }

}
