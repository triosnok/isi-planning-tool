package no.isi.insight.planning.geometry;

import java.util.Optional;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.WKTReader;
import org.locationtech.proj4j.CRSFactory;
import org.locationtech.proj4j.CoordinateTransform;
import org.locationtech.proj4j.CoordinateTransformFactory;
import org.locationtech.proj4j.ProjCoordinate;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GeometryService {
  private final GeometryFactory geometryFactory;
  private final WKTReader wktReader;
  private final PrecisionModel precisionModel;
  private final CoordinateTransform gpsToRail;

  public GeometryService(
      GeometryProperties properties
  ) {
    this.precisionModel = new PrecisionModel();
    this.geometryFactory = new GeometryFactory(
      this.precisionModel,
      properties.getSRID()
    );

    this.wktReader = new WKTReader(this.geometryFactory);

    var crsFactory = new CRSFactory();
    var gpsCrs = crsFactory.createFromName("EPSG:4326");
    var railingCrs = crsFactory.createFromName("EPSG:25833");
    var transformFactory = new CoordinateTransformFactory();

    this.gpsToRail = transformFactory.createTransform(gpsCrs, railingCrs);
  }

  /**
   * Parses a LineString from a WKT string.
   * 
   * @param wkt the WKT to parse
   * 
   * @return the parsed LineString, if successful
   */
  public Optional<LineString> parseLineString(
      String wkt
  ) {
    try {
      var geom = this.wktReader.read(wkt);

      return switch (geom) {
        case LineString ls -> Optional.of(ls);
        default -> Optional.empty();
      };
    } catch (Exception e) {
      log.debug("Failed to parse wkt: {}", e.getMessage(), e);
      return Optional.empty();
    }
  }

  /**
   * Parses a Point from a WKT string.
   * 
   * @param wkt the WKT to parse
   * @return the parsed Point, if successful
   */
  public Optional<Point> parsePoint(
      String wkt
  ) {
    try {
      var geom = this.wktReader.read(wkt);

      return switch (geom) {
        case Point point -> Optional.of(point);
        default -> Optional.empty();
      };
    } catch (Exception e) {
      log.debug("Failed to parse wkt: {}", e.getMessage(), e);
      return Optional.empty();
    }
  }

  /**
   * Creates a Point from the given coordinates.
   * 
   * @param lon the longitude
   * @param lat the latitude
   * 
   * @return the created Point
   */
  public Point createPoint(
      Double lon,
      Double lat
  ) {
    return this.geometryFactory.createPoint(
      new Coordinate(
        lon,
        lat
      )
    );
  }

  /**
   * Projects a line from the reference point with the given heading and length.
   * 
   * @param reference the reference point
   * @param heading   the heading in degrees
   * @param length    the length of the line
   * 
   * @return the projected line
   */
  public LineString project(
      Point reference,
      double heading,
      double length
  ) {
    var radians = Math.toRadians(heading);

    var endX = reference.getX() + length * Math.cos(radians);
    var endY = reference.getY() + length * Math.sin(radians);

    var coordinates = new Coordinate[] {
        new Coordinate(
          reference.getX(),
          reference.getY()
        ),
        new Coordinate(
          endX,
          endY
        )
    };

    return this.geometryFactory.createLineString(coordinates);
  }

  /**
   * Transforms a GPS point to a rail point.
   * 
   * @param point
   * @return
   */
  public Point transformGpsToRail(
      Point point
  ) {
    var coords = point.getCoordinate();

    var transformed = this.gpsToRail.transform(
      new ProjCoordinate(
        coords.getX(),
        coords.getY()
      ),
      new ProjCoordinate()
    );

    return this.createPoint(transformed.x, transformed.y);
  }

}
