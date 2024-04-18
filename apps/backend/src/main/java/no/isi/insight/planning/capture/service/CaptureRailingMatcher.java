package no.isi.insight.planning.capture.service;

import java.util.List;
import java.util.Optional;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.linearref.LengthIndexedLine;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.capture.model.RailingMatchResult;
import no.isi.insight.planning.geometry.GeometryService;
import no.isi.insight.planning.model.RoadDirection;
import no.isi.insight.planning.model.RoadRailing;
import no.isi.insight.planning.model.RoadSide;

@RequiredArgsConstructor
public class CaptureRailingMatcher {
  private final List<RoadRailing> railings;
  private final GeometryService geometryService;
  private final double length;

  private RoadRailing lastMatchedRailing;

  private static final double CAMERA_FOV = 60.0;

  private Polygon createPolygon(
      Point point,
      double heading,
      double height
  ) {
    var factory = point.getFactory();
    var a = point.getCoordinate();

    var sideLength = height / Math.cos(Math.toRadians(CAMERA_FOV / 2));

    var b = this.geometryService.project(a, heading - (CAMERA_FOV / 2), sideLength);
    var c = this.geometryService.project(a, heading + (CAMERA_FOV / 2), sideLength);

    return factory.createPolygon(new Coordinate[] {
        a, b, c, a
    });
  }

  public Optional<RailingMatchResult> matchRailing(
      Point point,
      Double heading
  ) {
    var left = this.createPolygon(point, heading - 90, this.length);
    var right = this.createPolygon(point, heading + 90, this.length);

    RoadRailing matchedRailing = null;

    if (this.lastMatchedRailing != null && (this.lastMatchedRailing.getGeometry().intersects(left)
        ^ this.lastMatchedRailing.getGeometry().intersects(right))) {
      matchedRailing = this.lastMatchedRailing;
    }

    if (matchedRailing == null) {
      for (var railing : this.railings) {
        var geometry = railing.getGeometry();

        if (right.intersects(geometry) ^ left.intersects(geometry)) {
          matchedRailing = railing;
          break;
        }
      }
    }

    if (matchedRailing == null || matchedRailing.getRoadSegments().size() == 0) {
      return Optional.empty();
    }

    var matchedSide = RoadSide.LEFT;
    var usedPoly = left;

    if (right.intersects(matchedRailing.getGeometry())) {
      matchedSide = RoadSide.RIGHT;
      usedPoly = right;
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

    var indexedRailing = new LengthIndexedLine(this.lastMatchedRailing.getGeometry());
    var intersect = usedPoly.intersection(this.lastMatchedRailing.getGeometry());
    var intersectCoords = intersect.getCoordinates();
    var matchStartIdx = 0.0;
    var matchEndIdx = 0.0;

    if (intersectCoords.length > 2) {
      var first = intersectCoords[0];
      var last = intersectCoords[intersectCoords.length - 1];
      matchStartIdx = indexedRailing.project(first);
      matchEndIdx = indexedRailing.project(last);
    }

    var result = new RailingMatchResult(
      point,
      heading,
      matchedRailing,
      roadSegment,
      matchedSide,
      matchStartIdx,
      matchEndIdx
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
    var refZ = reference.getZ();
    var nearZ = nearest.getZ();

    return Double.isNaN(refZ) || Double.isNaN(nearZ) || Math.abs(refZ - nearZ) < MAX_HEIGHT_DELTA;
  }
}
