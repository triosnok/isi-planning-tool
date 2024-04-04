package no.isi.insight.planning.capture.service;

import no.isi.insight.planning.capture.model.ProcessedLogEntry;

public interface CaptureLogListener {

  void onLogEntry(
      ProcessedLogEntry entry,
      CaptureLogReplay replay
  );

}
