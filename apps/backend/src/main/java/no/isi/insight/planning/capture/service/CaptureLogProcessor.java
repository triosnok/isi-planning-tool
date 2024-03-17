package no.isi.insight.planning.capture.service;

import java.io.File;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planner.client.trip.view.CameraPosition;
import no.isi.insight.planning.capture.config.CaptureProcessingConfig;
import no.isi.insight.planning.capture.model.CameraLogEntry;
import no.isi.insight.planning.capture.model.PositionLogEntry;
import no.isi.insight.planning.capture.model.ProcessedLogEntry;
import no.isi.insight.planning.geometry.GeometryService;

@Slf4j
@Service
public class CaptureLogProcessor {
  private final CsvSchema gnssSchema;
  private final CsvSchema cameraSchema;
  private final CsvMapper mapper;
  private final GeometryService geometryService;

  private final long maxDeltaMs;

  public CaptureLogProcessor(
      CaptureProcessingConfig processingConfig,
      GeometryService geometryService
  ) {
    this.mapper = new CsvMapper();
    this.mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    this.gnssSchema = this.mapper.schemaFor(PositionLogEntry.class).withHeader().withColumnReordering(true);
    this.cameraSchema = this.mapper.schemaFor(CameraLogEntry.class).withHeader().withColumnReordering(true);
    this.geometryService = geometryService;
    this.maxDeltaMs = processingConfig.getMaxDeltaMs();
  }

  /**
   * Processes the given logs and returns a list of processed log entries.
   * 
   * @param gnssLog    the GNSS log file
   * @param cameraLogs the camera log files, mapped by position
   * 
   * @throws IOException if an error occurs while reading the log files
   */
  public List<ProcessedLogEntry> processLogs(
      File gnssLog,
      Map<CameraPosition, File> cameraLogs
  ) throws IOException {
    if (!gnssLog.canRead() && !cameraLogs.values().stream().allMatch(File::canRead)) {
      log.warn("Missing read permissions for log files");
      throw new IllegalStateException("Missing read permissions for processing capture log files.");
    }

    var results = new ArrayList<ProcessedLogEntry>();

    MappingIterator<PositionLogEntry> gnssIterator = this.mapper.readerFor(PositionLogEntry.class)
      .with(this.gnssSchema)
      .readValues(gnssLog);

    var cameraIterators = new HashMap<CameraPosition, MappingIterator<CameraLogEntry>>();

    for (var entry : cameraLogs.entrySet()) {
      var position = entry.getKey();
      var file = entry.getValue();

      MappingIterator<CameraLogEntry> iterator = mapper.readerFor(CameraLogEntry.class)
        .with(this.cameraSchema)
        .readValues(file);

      cameraIterators.put(position, iterator);
    }

    int gnssSkips = 0;
    int leftCount = 0;
    int rightCount = 0;
    int topCount = 0;

    var cameraSkips = new HashMap<CameraPosition, Integer>();

    cameraSkips.put(CameraPosition.TOP, 0);
    cameraSkips.put(CameraPosition.LEFT, 0);
    cameraSkips.put(CameraPosition.RIGHT, 0);

    CameraLogMatchResult left = CameraLogMatchResult.skip(Optional.empty());
    CameraLogMatchResult right = CameraLogMatchResult.skip(Optional.empty());
    CameraLogMatchResult top = CameraLogMatchResult.skip(Optional.empty());

    // essentially, we want to iterate over the GNSS log and find the corresponding camera log entries.
    // if no camera log entries match the GNSS entry (approximately), we skip it.
    // matches with >1 camera log entries (images) will be added to the result.
    while (gnssIterator.hasNext()) {
      var gnss = gnssIterator.next();

      left = this.nextMatch(gnss.getTimestamp(), cameraIterators.get(CameraPosition.LEFT), left.getEntry());
      right = this.nextMatch(gnss.getTimestamp(), cameraIterators.get(CameraPosition.RIGHT), right.getEntry());
      top = this.nextMatch(gnss.getTimestamp(), cameraIterators.get(CameraPosition.TOP), top.getEntry());

      var matches = List.of(left, right, top);

      if (!matches.stream().anyMatch(e -> e.should(CameraResultType.KEEP))) {
        gnssSkips++;
        continue;
      }

      var point = this.geometryService.createPoint(gnss.getLongitude(), gnss.getLatitude());
      var timestamp = LocalDateTime.ofInstant(Instant.ofEpochMilli(gnss.getTimestamp()), ZoneId.systemDefault());

      var images = new HashMap<CameraPosition, String>();

      for (var match : matches) {
        if (match.getEntry().isPresent() && match.should(CameraResultType.KEEP)) {
          var entry = match.getEntry().get();

          switch (entry.getPosition()) {
            case TOP -> topCount++;
            case LEFT -> leftCount++;
            case RIGHT -> rightCount++;
          }

          images.put(entry.getPosition(), entry.getFileName());
        }
      }

      var processed = new ProcessedLogEntry(
        point,
        gnss.getHeading(),
        timestamp,
        images
      );

      results.add(processed);
    }

    log.info(
      "Finished processing capture logs. Skipped {} GNSS entries. [LEFT={},RIGHT={},TOP={}]",
      gnssSkips,
      leftCount,
      rightCount,
      topCount
    );

    return results;
  }

  /**
   * Helper method for finding the next camera log entry for the given GNSS timestamp. Will only
   * iterate when the delta is negative and outside the given threshold.
   * 
   * @param gnssTimestamp the GNSS timestamp
   * @param iterator      the camera log iterator
   * @param current       the current camera log entry
   * 
   * @return the next camera log entry, if found
   */
  private CameraLogMatchResult nextMatch(
      Long gnssTimestamp,
      MappingIterator<CameraLogEntry> iterator,
      Optional<CameraLogEntry> current
  ) {
    if (!current.isPresent() && !iterator.hasNext()) {
      return CameraLogMatchResult.skip(Optional.empty());
    }

    CameraLogEntry nextEntry = current.orElseGet(() -> iterator.hasNext() ? iterator.next() : null);

    while (nextEntry != null) {
      long deltaMs = nextEntry.getTimestamp() - gnssTimestamp;

      // TODO: Revisit this logic, not sure if it should be inclusive or exclusive in which end.
      if (deltaMs >= 0 && deltaMs < this.maxDeltaMs) {
        return CameraLogMatchResult.keep(Optional.of(nextEntry));
      } else if (deltaMs > this.maxDeltaMs) {
        return CameraLogMatchResult.skip(Optional.of(nextEntry));
      } else {
        log.info("iterating to next delta {}", deltaMs);
        nextEntry = iterator.hasNext() ? iterator.next() : null;
      }
    }

    return CameraLogMatchResult.skip(Optional.empty());
  }

  @Getter
  private static final class CameraLogMatchResult {
    private final CameraResultType type;
    private final Optional<CameraLogEntry> entry;

    private CameraLogMatchResult(
        CameraResultType type,
        Optional<CameraLogEntry> entry
    ) {
      this.type = type;
      this.entry = entry;
    }

    public static CameraLogMatchResult keep(
        Optional<CameraLogEntry> entry
    ) {
      return new CameraLogMatchResult(
        CameraResultType.KEEP,
        entry
      );
    }

    public static CameraLogMatchResult skip(
        Optional<CameraLogEntry> entry
    ) {
      return new CameraLogMatchResult(
        CameraResultType.SKIP,
        entry
      );
    }

    public boolean should(
        CameraResultType type
    ) {
      return this.type == type;
    }
  }

  private static enum CameraResultType {
    KEEP,
    SKIP
  }

}
