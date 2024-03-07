package no.isi.insight.planning.capture.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import no.isi.insight.planner.client.trip.view.CameraPosition;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CameraLogEntry extends LogEntry {

  @JsonProperty("filename")
  private String fileName;

  @JsonProperty("timestamp")
  private Long timestamp;

  @JsonProperty("camera")
  private CameraPosition position;

  /**
   * Returns the timestamp of the log entry in milliseconds.
   */
  public Long getTimestamp() {
    // the timestamp is originally in nanoseconds
    return this.timestamp / 1_000_000L;
  }

}
