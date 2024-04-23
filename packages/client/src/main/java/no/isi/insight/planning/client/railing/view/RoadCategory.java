package no.isi.insight.planning.client.railing.view;

public enum RoadCategory {
  PRIVATE("P"),
  FOREST("S"),
  MUNICIPALITY("K"),
  COUNTY("F"),
  NATIONAL("R"),
  EUROPE("E"),
  UNKNOWN(null);

  private final String shortCode;

  private RoadCategory(
      String shortCode
  ) {
    this.shortCode = shortCode;
  }

  public static RoadCategory fromShortCode(
      String shortCode
  ) {
    for (var category : RoadCategory.values()) {
      if (shortCode.equalsIgnoreCase(category.shortCode)) {
        return category;
      }
    }

    return RoadCategory.UNKNOWN;
  }
}
