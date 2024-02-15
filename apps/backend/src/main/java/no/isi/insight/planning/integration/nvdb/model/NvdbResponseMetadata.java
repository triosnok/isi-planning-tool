package no.isi.insight.planning.integration.nvdb.model;

import com.fasterxml.jackson.annotation.JsonAlias;

public record NvdbResponseMetadata(
  @JsonAlias("antall") int total,
  @JsonAlias("returnert") int returned,
  @JsonAlias("sidestørrelse") int pageSize,
  @JsonAlias("neste") NextPageMetadata nextPage
) {

  public static record NextPageMetadata(String start, String href) {}

}
