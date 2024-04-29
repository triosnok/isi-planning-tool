package no.isi.insight.planning.capture.service;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;
import java.util.Optional;

import no.isi.insight.planning.capture.model.ProcessedLogEntry;
import no.isi.insight.planning.client.capture.view.CaptureDetails;
import no.isi.insight.planning.client.trip.view.CameraPosition;

public class CaptureLogReplay {
  private final ListIterator<ProcessedLogEntry> log;
  private final int speed;
  private final Map<CameraPosition, Long> images;
  private final CaptureLogListener listener;
  private final ImageAnalysisService imageAnalysisService;

  private int metersCaptured;
  private boolean playing;
  private ProcessedLogEntry previousEntry;

  /**
   * Creates a new log replay. The log is replayed at the given speed, in seconds per second.
   * 
   * @param log   the log to replay
   * @param speed the speed to replay the log at, in seconds per second
   */
  public CaptureLogReplay(
      List<ProcessedLogEntry> log,
      int speed,
      CaptureLogListener listener,
      ImageAnalysisService imageAnalysisService
  ) {
    this.log = log.listIterator();
    this.speed = speed;
    this.images = new HashMap<>();
    this.listener = listener;
    this.metersCaptured = 0;
    this.imageAnalysisService = imageAnalysisService;

    // play the first second of the log to start with
    this.playing = true;
    this.replaySecond();
    this.playing = false;
  }

  public void incrementMetersCaptured() {
    this.metersCaptured++;
  }

  /**
   * Replays the log at the configured speed. Expected to be called every second.
   */
  public void replaySecond() {
    if (!this.log.hasNext() || !this.playing) {
      return;
    }

    ProcessedLogEntry current = null;
    var scanning = true;

    while (scanning && this.log.hasNext()) {
      current = this.log.next();

      if (previousEntry != null) {
        var delta = Duration.between(previousEntry.timestamp(), current.timestamp()).toMillis();
        if (delta >= 1000 * this.speed) {
          scanning = false;
        }
      }

      if (current.images().containsKey(CameraPosition.LEFT)) {
        var count = this.images.getOrDefault(CameraPosition.LEFT, 0L) + 1;
        this.images.put(CameraPosition.LEFT, count);
      }

      if (current.images().containsKey(CameraPosition.RIGHT)) {
        var count = this.images.getOrDefault(CameraPosition.RIGHT, 0L) + 1;
        this.images.put(CameraPosition.RIGHT, count);
      }

      if (current.images().containsKey(CameraPosition.TOP)) {
        var count = this.images.getOrDefault(CameraPosition.TOP, 0L) + 1;
        this.images.put(CameraPosition.TOP, count);
      }

      // only occurs for the first entry in the replay
      if (this.previousEntry == null) {
        this.previousEntry = current;
      }

      this.listener.onLogEntry(current, this);
    }

    this.previousEntry = current;
  }

  /**
   * Pauses the replay.
   */
  public void pause() {
    this.playing = false;
  }

  /**
   * Resumes the replay.
   */
  public void resume() {
    this.playing = true;
  }

  /**
   * Returns true if the replay is finished.
   * 
   * @return true if the replay is finished
   */
  public boolean finished() {
    return !this.log.hasNext();
  }

  /**
   * Returns the capture details at the current point of the replay.
   * 
   * @return the capture details
   */
  public Optional<CaptureDetails> getCaptureDetails() {
    if (this.previousEntry == null) {
      return Optional.empty();
    }

    var imageAnalysis = this.imageAnalysisService.getImageAnalysis(this.images);

    return Optional.of(
      new CaptureDetails(
        0L,
        0L,
        this.previousEntry.position(),
        this.previousEntry.heading(),
        0.99f,
        this.playing && !this.finished(),
        this.metersCaptured,
        this.images,
        imageAnalysis
      )
    );
  }

}
