package no.isi.insight.planning.capture.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("no.isi.insight.planning.capture")
public record CaptureProcessingConfig(Long maxDeltaMs, Integer gnssSrid) {

  public Long getMaxDeltaMs() {
    return this.maxDeltaMs != null ? this.maxDeltaMs : 10L;
  }

  public Integer getSRID() {
    return this.gnssSrid != null ? this.gnssSrid : 4326;
  }

}
