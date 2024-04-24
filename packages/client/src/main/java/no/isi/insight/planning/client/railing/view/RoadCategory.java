package no.isi.insight.planning.client.railing.view;

import com.fasterxml.jackson.annotation.JsonAlias;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public enum RoadCategory {
  @JsonAlias("P")
  PRIVATE("P"),
  @JsonAlias("S")
  FOREST("S"),
  @JsonAlias("K")
  MUNICIPALITY("K"),
  @JsonAlias("F")
  COUNTY("F"),
  @JsonAlias("R")
  NATIONAL("R"),
  @JsonAlias("E")
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
