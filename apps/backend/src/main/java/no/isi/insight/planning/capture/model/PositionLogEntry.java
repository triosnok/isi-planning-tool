package no.isi.insight.planning.capture.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PositionLogEntry extends LogEntry {

  @JsonProperty("GPSTS")
  private Long timestamp;

  @JsonProperty("Lat")
  private Double latitude;

  @JsonProperty("Lon")
  private Double longitude;

  @JsonProperty("Heading")
  private Double heading;

}
