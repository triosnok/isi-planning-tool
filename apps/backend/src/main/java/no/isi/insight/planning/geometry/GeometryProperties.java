package no.isi.insight.planning.geometry;

import java.util.Optional;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "no.isi.insight.planning.geometry")
public record GeometryProperties(Integer srid) {

  public Integer getSRID() {
    return Optional.ofNullable(this.srid).orElse(5973);
  }

}
