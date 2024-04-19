package no.isi.insight.planning.capture.service;

import java.util.List;
import java.util.Optional;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.linearref.LengthIndexedLine;

import io.hypersistence.utils.hibernate.type.range.Range;
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

  // these could probably be configurable
  private static final double CAMERA_FOV = 60.0;
  private static final double TOP_CAMERA_FOV = 80.0;
  private static final double SEGMENT_LENGTH = 1.0 / 2;

  private Polygon createPolygon(
      Point point,
      double heading,
      double height,
      double fov
  ) {
    var factory = point.getFactory();
    var a = point.getCoordinate();

    var sideLength = height / Math.cos(Math.toRadians(fov / 2));

    var b = this.geometryService.project(a, heading - (fov / 2), sideLength);
    var c = this.geometryService.project(a, heading + (fov / 2), sideLength);

    return factory.createPolygon(new Coordinate[] {
        a, b, c, a
    });
  }

  private Range<Double> computeCoverage(
      Polygon polygon,
      LineString geometry,
      LengthIndexedLine indexedLine
  ) {
    var intersect = polygon.intersection(geometry);
    var intersectCoords = intersect.getCoordinates();
    var startIdx = 0.0;
    var endIdx = 0.0;

    if (intersectCoords.length > 2) {
      var first = intersectCoords[0];
      var last = intersectCoords[intersectCoords.length - 1];
      startIdx = indexedLine.project(first);
      endIdx = indexedLine.project(last);
    }

    return Range.closed(startIdx, endIdx);
  }

  public Optional<RailingMatchResult> matchRailing(
      Point point,
      Double heading
  ) {
    var leftAngle = heading - 90;
    var rightAngle = heading + 90;

    var left = this.createPolygon(point, leftAngle, this.length, TOP_CAMERA_FOV);
    var right = this.createPolygon(point, rightAngle, this.length, TOP_CAMERA_FOV);

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
    var topPoly = left;

    if (right.intersects(matchedRailing.getGeometry())) {
      matchedSide = RoadSide.RIGHT;
      topPoly = right;
    }

    this.lastMatchedRailing = matchedRailing;

    var nearestSegment = matchedRailing.getRoadSegments().stream().sorted((a, b) -> {
      var distanceA = a.getGeometry().distance(point);
      var distanceB = b.getGeometry().distance(point);

      return Double.compare(distanceA, distanceB);
    }).findFirst();

    var roadSegment = nearestSegment.get();
    var indexedSegment = new LengthIndexedLine(roadSegment.getGeometry());

    var segmentIdx = indexedSegment.project(point.getCoordinate());
    var segmentStartIdx = Math.max(segmentIdx - SEGMENT_LENGTH, indexedSegment.getStartIndex());
    var segmentEndIdx = Math.min(segmentIdx + SEGMENT_LENGTH, indexedSegment.getEndIndex());

    var nearest = indexedSegment.extractPoint(segmentIdx);

    if (!this.isWithinHeight(point.getCoordinate(), nearest)) {
      return Optional.empty();
    }

    var segmentStart = indexedSegment.extractPoint(segmentStartIdx);
    var segmentEnd = indexedSegment.extractPoint(segmentEndIdx);

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

    var sideAngle = matchedSide == RoadSide.LEFT ? leftAngle : rightAngle;
    var sidePoly = this.createPolygon(point, sideAngle, this.length, CAMERA_FOV);

    var indexedRailing = new LengthIndexedLine(this.lastMatchedRailing.getGeometry());

    var railingTopCoverage = this.computeCoverage(topPoly, this.lastMatchedRailing.getGeometry(), indexedRailing);
    var railingSideCoverage = this.computeCoverage(sidePoly, this.lastMatchedRailing.getGeometry(), indexedRailing);
    var segmentCoverage = Range.closed(segmentStartIdx, segmentEndIdx);

    var result = new RailingMatchResult(
      point,
      heading,
      matchedRailing,
      roadSegment,
      matchedSide,
      railingTopCoverage,
      railingSideCoverage,
      segmentIdx,
      segmentCoverage
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
