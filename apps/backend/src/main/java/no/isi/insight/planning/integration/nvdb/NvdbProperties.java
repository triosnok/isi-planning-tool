package no.isi.insight.planning.integration.nvdb;

import java.util.Optional;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "no.isi.insight.planning.integration.nvdb")
public record NvdbProperties(String baseUrl, String clientName) {

  public String getClientName() {
    return Optional.ofNullable(this.clientName).orElse("isi-insight");
  }

}
