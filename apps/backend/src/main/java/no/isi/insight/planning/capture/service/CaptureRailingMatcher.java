package no.isi.insight.planning.capture.service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.ArrayList;
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
import no.isi.insight.planning.db.model.RoadDirection;
import no.isi.insight.planning.db.model.RoadRailing;
import no.isi.insight.planning.db.model.RoadSide;

@RequiredArgsConstructor
public class CaptureRailingMatcher {
  private final List<RoadRailing> railings;
  private final GeometryService geometryService;
  private final double length;

  // these could probably be configurable
  private static final double CAMERA_FOV = 60.0;
  private static final double TOP_CAMERA_FOV = 80.0;
  private static final double SEGMENT_LENGTH = 1.0 / 2;

  /**
   * Creates a triangle polygon with the given point as the top vertex.
   * 
   * @param point   the point to create the polygon around
   * @param heading the heading of the camera
   * @param height  the height of the triangle polygon
   * @param fov     the field of view of the camera
   * 
   * @return the created polygon
   */
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

  /**
   * Computes the coverage of a polygon on a line geometry. Picks the first and the last coordinate of
   * the intersection, and returns a range with the index of those coordinates on the line.
   * 
   * @param polygon     the polygon to compute coverage for
   * @param line        the line geometry to compute coverage on
   * @param indexedLine the indexed line to use for projection
   * 
   * @return the range of the coverage
   */
  private Range<BigDecimal> computeCoverage(
      Polygon polygon,
      LineString line,
      LengthIndexedLine indexedLine
  ) {
    var intersect = polygon.intersection(line);
    var intersectCoords = intersect.getCoordinates();
    var startIdx = 0.0;
    var endIdx = 0.0;

    if (intersectCoords.length > 2) {
      var first = intersectCoords[0];
      var last = intersectCoords[intersectCoords.length - 1];
      startIdx = indexedLine.project(first);
      endIdx = indexedLine.project(last);
    }

    return Range.closed(
      new BigDecimal(
        startIdx,
        MathContext.DECIMAL64
      ),
      new BigDecimal(
        endIdx,
        MathContext.DECIMAL64
      )
    );
  }

  /**
   * Matches a point and heading to the railings in the matcher. Returns a list of zero or more
   * matches.
   * 
   * @param point   the reference point to match from
   * @param heading the direction points associated direction
   * 
   * @return a list of matches
   */
  public List<RailingMatchResult> matchRailings(
      Point point,
      Double heading
  ) {
    var leftAngle = heading - 90;
    var rightAngle = heading + 90;

    var left = this.createPolygon(point, leftAngle, this.length, TOP_CAMERA_FOV);
    var right = this.createPolygon(point, rightAngle, this.length, TOP_CAMERA_FOV);

    var hitRailings = new ArrayList<PotentialMatch>();

    for (var railing : this.railings) {
      var geometry = railing.getGeometry();
      var rightIntersects = right.intersects(geometry);

      // exclusive or, cases where both sides match are probably not an actual match
      if (rightIntersects ^ left.intersects(geometry)) {
        hitRailings.add(
          new PotentialMatch(
            railing,
            rightIntersects ? RoadSide.RIGHT : RoadSide.LEFT,
            rightIntersects ? right : left,
            rightIntersects ? rightAngle : leftAngle
          )
        );
      }
    }

    return hitRailings.stream()
      .map(pm -> this.processPotentialMatch(point, heading, pm))
      .filter(Optional::isPresent)
      .map(Optional::get)
      .toList();
  }

  private Optional<RailingMatchResult> processPotentialMatch(
      Point point,
      double heading,
      PotentialMatch match
  ) {
    var nearestSegment = match.railing().getRoadSegments().stream().sorted((a, b) -> {
      var distanceA = a.getGeometry().distance(point);
      var distanceB = b.getGeometry().distance(point);

      return Double.compare(distanceA, distanceB);
    }).findFirst();

    var roadSegment = nearestSegment.get();
    var indexedSegment = new LengthIndexedLine(roadSegment.getGeometry());

    var segmentIdx = indexedSegment.project(point.getCoordinate());
    var nearest = indexedSegment.extractPoint(segmentIdx);

    if (!this.isWithinHeight(point.getCoordinate(), nearest)) {
      return Optional.empty();
    }

    var segmentStartIdx = Math.max(segmentIdx - SEGMENT_LENGTH, indexedSegment.getStartIndex());
    var segmentEndIdx = Math.min(segmentIdx + SEGMENT_LENGTH, indexedSegment.getEndIndex());

    var matchedSide = match.side();

    // special processing for railings whose geometry is the same as the road segments.
    // consideration of whether or not the match has happened on the appropriate side
    // is external to this matcher.
    if (!match.railing().isOwnGeometry()) {
      var segmentStart = indexedSegment.extractPoint(segmentStartIdx);
      var segmentEnd = indexedSegment.extractPoint(segmentEndIdx);
      var segmentAngle = Math
        .toDegrees(Math.atan2(segmentEnd.getY() - segmentStart.getY(), segmentEnd.getX() - segmentStart.getX()));
      var inferredDirection = this.getDirection(segmentAngle, heading);

      if (inferredDirection != roadSegment.getDirection()) {
        matchedSide = roadSegment.getSide();
      } else {
        matchedSide = roadSegment.getSide().opposite();
      }
    }

    var sidePoly = this.createPolygon(point, match.angle(), this.length, CAMERA_FOV);
    var indexedRailing = new LengthIndexedLine(match.railing().getGeometry());
    var railingTopCoverage = this.computeCoverage(match.polygon(), match.railing().getGeometry(), indexedRailing);
    var railingSideCoverage = this.computeCoverage(sidePoly, match.railing().getGeometry(), indexedRailing);
    var segmentCoverage = Range.closed(
      new BigDecimal(
        segmentStartIdx,
        MathContext.DECIMAL64
      ),
      new BigDecimal(
        segmentEndIdx,
        MathContext.DECIMAL64
      )
    );

    var result = new RailingMatchResult(
      point,
      heading,
      match.railing(),
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

  private static record PotentialMatch(RoadRailing railing, RoadSide side, Polygon polygon, double angle) {}

}
