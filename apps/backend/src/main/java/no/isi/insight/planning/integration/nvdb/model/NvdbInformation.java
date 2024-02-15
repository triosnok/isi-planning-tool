package no.isi.insight.planning.integration.nvdb.model;

public enum NvdbInformation {
  METADATA("metadata"),
  PROPERTIES("egenskaper"),
  RELATIONS("relasjoner"),
  LOCATION("lokasjon"),
  ROAD_SEGMENTS("vegsegmenter"),
  GEOMETRY("geometri"),
  MINIMUM("minimum"),
  ALL("alle");

  public final String NAME;

  private NvdbInformation(
      String name
  ) {
    NAME = name;
  }
}
