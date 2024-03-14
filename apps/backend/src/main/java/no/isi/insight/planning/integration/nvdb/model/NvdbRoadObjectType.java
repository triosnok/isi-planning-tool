package no.isi.insight.planning.integration.nvdb.model;

public enum NvdbRoadObjectType {
  RAILING(5),
  ROAD_NET(915);

  private final int id;

  private NvdbRoadObjectType(
      int id
  ) {
    this.id = id;
  }

  public int getId() {
    return id;
  }
}
