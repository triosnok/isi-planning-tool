package no.isi.insight.planning.integration.nvdb.model;

import com.fasterxml.jackson.annotation.JsonAlias;

public record NvdbRoadObject(long id, @JsonAlias("geometri") Geometry geometry) {

  public static record Geometry(String wkt, int srid, @JsonAlias("egengeometri") boolean isOwnGeomtry) {}

  public static record Location(@JsonAlias("geometri") Geometry geometry) {}

}
