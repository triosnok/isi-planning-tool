package no.isi.insight.planning.capture.service;

import java.util.List;
import java.util.Optional;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.linearref.LengthIndexedLine;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.capture.model.RailingMatchResult;
import no.isi.insight.planning.geometry.GeometryService;
import no.isi.insight.planning.model.RoadDirection;
import no.isi.insight.planning.model.RoadRailing;
import no.isi.insight.planning.model.RoadSide;

@Slf4j
@RequiredArgsConstructor
public class CaptureRailingMatcher {
  private final List<RoadRailing> railings;
  private final GeometryService geometryService;
  private final double length;

  private RoadRailing lastMatchedRailing;

  public Optional<RailingMatchResult> matchRailing(
      Point point,
      Double heading
  ) {
    var left = this.geometryService.project(point, heading - 90, this.length);
    var right = this.geometryService.project(point, heading + 90, this.length);

    RoadRailing matchedRailing = null;

    if (this.lastMatchedRailing != null && (left.intersects(this.lastMatchedRailing.getGeometry())
        ^ right.intersects(this.lastMatchedRailing.getGeometry()))) {
      matchedRailing = this.lastMatchedRailing;
    }

    if (matchedRailing == null) {
      for (var railing : this.railings) {
        var geometry = railing.getGeometry();

        if (geometry.intersects(left) ^ geometry.intersects(right)) {
          matchedRailing = railing;
          break;
        }
      }
    }

    if (matchedRailing == null || matchedRailing.getRoadSegments().size() == 0) {
      return Optional.empty();
    }

    var matchedSide = RoadSide.LEFT;

    if (right.intersects(matchedRailing.getGeometry())) {
      matchedSide = RoadSide.RIGHT;
    }

    this.lastMatchedRailing = matchedRailing;

    var nearestSegment = matchedRailing.getRoadSegments().stream().sorted((a, b) -> {
      var distanceA = a.getGeometry().distance(point);
      var distanceB = b.getGeometry().distance(point);

      return Double.compare(distanceA, distanceB);
    }).findFirst();

    var roadSegment = nearestSegment.get();
    var indexedSegment = new LengthIndexedLine(roadSegment.getGeometry());

    var nearestPoint = indexedSegment.project(point.getCoordinate());
    var startIdx = Math.max(nearestPoint - 0.5, indexedSegment.getStartIndex());
    var endIdx = Math.min(nearestPoint + 0.5, indexedSegment.getEndIndex());

    var nearest = indexedSegment.extractPoint(nearestPoint);

    if (!this.isWithinHeight(point.getCoordinate(), nearest)) {
      return Optional.empty();
    }

    var segmentStart = indexedSegment.extractPoint(startIdx);
    var segmentEnd = indexedSegment.extractPoint(endIdx);

    var segmentAngle = Math
      .toDegrees(Math.atan2(segmentEnd.getY() - segmentStart.getY(), segmentEnd.getX() - segmentStart.getX()));
    var inferredDirection = this.getDirection(segmentAngle, heading);

    if (!matchedRailing.isOwnGeometry()) {
      if (inferredDirection != roadSegment.getDirection()) {
        matchedSide = roadSegment.getSide();
      } else {
        matchedSide = roadSegment.getSide().opposite();
      }
    }

    var result = new RailingMatchResult(
      point,
      heading,
      matchedRailing,
      roadSegment,
      matchedSide
    );

    return Optional.of(result);
  }

  private RoadDirection getDirection(
      double angle,
      double referenceAngle
  ) {
    var diff = Math.abs(angle - referenceAngle);

    if (diff <= 90 || diff >= 270) {
      return RoadDirection.WITH;
    }

    return RoadDirection.AGAINST;
  }

  private static final double MAX_HEIGHT_DELTA = 1.0;

  private boolean isWithinHeight(
      Coordinate reference,
      Coordinate nearest
  ) {
    return true;
    // TODO: GNSS height requires special processing to be able to compare them
    // once that is in place, we can probably uncomment this

    // var refZ = reference.getZ();
    // var nearZ = nearest.getZ();

    // return refZ == Double.NaN || nearZ == Double.NaN || Math.abs(refZ - nearZ) < MAX_HEIGHT_DELTA;
  }
}
