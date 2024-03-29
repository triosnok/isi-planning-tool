package no.isi.insight.planning.capture.service;

import static org.junit.Assert.assertEquals;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import no.isi.insight.planning.capture.model.ProcessedLogEntry;
import no.isi.insight.planning.client.geometry.Geometry;

class CaptureLogReplayTests {

  private List<ProcessedLogEntry> generateLog() {
    var startTime = LocalDateTime.now();
    var log = new ArrayList<ProcessedLogEntry>();

    for (int i = 0; i < 10; i++) {
      log.add(
        new ProcessedLogEntry(
          new Geometry(
            "POINT(%d 0)".formatted(i),
            4326
          ),
          0.0,
          startTime.plusSeconds(i),
          Map.of()
        )
      );
    }

    return log;
  }

  @Test
  void replaysAtGivenSpeed() {
    var log = this.generateLog();
    var replay = new CaptureLogReplay(
      log,
      1,
      (logEntry, logReplay) -> {}
    );

    var details = replay.getCaptureDetails();
    assertEquals("POINT(1 0)", details.get().position().wkt());
    replay.resume();

    replay.replaySecond();
    details = replay.getCaptureDetails();
    assertEquals("POINT(2 0)", details.get().position().wkt());

    replay.replaySecond();
    details = replay.getCaptureDetails();
    assertEquals("POINT(3 0)", details.get().position().wkt());

    replay.replaySecond();
    details = replay.getCaptureDetails();
    assertEquals("POINT(4 0)", details.get().position().wkt());
  }

  @Test
  void canPause() {
    var log = this.generateLog();
    var replay = new CaptureLogReplay(
      log,
      1,
      (logEntry, logReplay) -> {}
    );

    replay.resume();
    replay.replaySecond();
    replay.pause();

    var before = replay.getCaptureDetails();

    replay.replaySecond();

    var after = replay.getCaptureDetails();

    assertEquals(before, after);
  }

}
