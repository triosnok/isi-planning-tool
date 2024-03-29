package no.isi.insight.planning.capture.service;

import java.util.List;
import java.util.Optional;

import org.locationtech.jts.geom.Point;
import org.locationtech.jts.linearref.LengthIndexedLine;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.capture.model.RailingMatchResult;
import no.isi.insight.planning.geometry.GeometryService;
import no.isi.insight.planning.model.RoadDirection;
import no.isi.insight.planning.model.RoadRailing;

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
        || right.intersects(this.lastMatchedRailing.getGeometry()))) {
      matchedRailing = this.lastMatchedRailing;
    }

    if (matchedRailing == null) {
      for (var railing : this.railings) {
        var geometry = railing.getGeometry();

        if (geometry.intersects(left) || geometry.intersects(right)) {
          matchedRailing = railing;
          System.out.println("matched a railing...");
          break;
        }
      }
    }

    if (matchedRailing == null || matchedRailing.getRoadSegments().size() == 0) {
      return Optional.empty();
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

    var segment = indexedSegment.extractPoint(startIdx);
    var segmentEnd = indexedSegment.extractPoint(endIdx);

    var segmentAngle = Math
      .toDegrees(Math.atan2(segmentEnd.getY() - segment.getY(), segmentEnd.getX() - segment.getX()));
    var inferredDirection = this.getDirection(segmentAngle, heading);

    if (inferredDirection != roadSegment.getDirection()) {
      return Optional.empty();
    }

    var result = new RailingMatchResult(
      point,
      heading,
      matchedRailing,
      roadSegment
    );

    return Optional.of(result);
  }

  public RoadDirection getDirection(
      double angle,
      double referenceAngle
  ) {
    var diff = Math.abs(angle - referenceAngle);

    if (diff <= 90 || diff >= 270) {
      return RoadDirection.WITH;
    }

    return RoadDirection.AGAINST;
  }
}
