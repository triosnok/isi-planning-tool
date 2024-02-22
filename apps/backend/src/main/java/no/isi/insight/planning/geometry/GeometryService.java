package no.isi.insight.planning.geometry;

import java.util.Optional;

import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.PrecisionModel;
import org.locationtech.jts.io.WKTReader;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GeometryService {
  private final GeometryFactory geometryFactory;
  private final WKTReader wktReader;

  public GeometryService(
      GeometryProperties properties
  ) {
    this.geometryFactory = new GeometryFactory(
      new PrecisionModel(),
      properties.getSRID()
    );

    this.wktReader = new WKTReader(this.geometryFactory);
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

}
