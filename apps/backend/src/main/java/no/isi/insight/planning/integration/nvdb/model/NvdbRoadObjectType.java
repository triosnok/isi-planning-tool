package no.isi.insight.planning.integration.nvdb.model;

public enum NvdbRoadObjectType {
  RAILING(5);

  public final int ID;

  private NvdbRoadObjectType(
      int id
  ) {
    ID = id;
  }
}
