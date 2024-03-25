package no.isi.insight.planning.utility;

import no.isi.insight.planning.client.geometry.Geometry;

public class GeometryUtils {

  public static Geometry toClientGeometry(
      org.locationtech.jts.geom.Geometry geom
  ) {
    if (geom == null) {
      return null;
    }
    return new Geometry(
      geom.toText(),
      geom.getSRID()
    );
  }

}
