package no.isi.insight.planning.utility;

import org.locationtech.jts.io.WKTWriter;

import no.isi.insight.planning.client.geometry.Geometry;

public class GeometryUtils {

  private static final WKTWriter WKT_WRITER = new WKTWriter(3);

  public static Geometry toClientGeometry(
      org.locationtech.jts.geom.Geometry geom
  ) {
    if (geom == null) {
      return null;
    }
    return new Geometry(
      GeometryUtils.toWkt(geom),
      geom.getSRID()
    );
  }

  public static String toWkt(
      org.locationtech.jts.geom.Geometry geom
  ) {
    var coord = geom.getCoordinate();

    if (Double.isNaN(coord.getZ())) {
      return geom.toText();
    }

    return WKT_WRITER.write(geom);
  }

}
