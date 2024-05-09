package no.isi.insight.planning.client.capture;

import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.capture.view.CaptureActionRequest;
import no.isi.insight.planning.client.capture.view.CapturedMetersByDay;
import no.isi.insight.planning.client.capture.view.CaptureLogDetails;

@Tag(name = "Capture")
@HttpExchange("/api/v1/capture")
public interface CaptureRestService {

  @Operation(summary = "Uploads and processes a capture log")
  @PostExchange(contentType = MediaType.MULTIPART_FORM_DATA_VALUE)
  void uploadLogs(
      @RequestParam String logId,
      @RequestParam MultipartFile gnssLog,
      @RequestParam MultipartFile topCameraLog,
      @RequestParam MultipartFile leftCameraLog,
      @RequestParam MultipartFile rightCameraLog
  );

  @Operation(summary = "Lists uploaded capture logs")
  @GetExchange("/logs")
  List<CaptureLogDetails> getCaptureLogs();

  @Operation(summary = "Event-stream of an ongoing captures details")
  @GetExchange("/stream")
  SseEmitter streamCapture(
      @RequestParam UUID tripId
  );

  @Operation(summary = "Perform an action on an ongoing capture")
  @PostExchange("/actions")
  ResponseEntity<Void> captureAction(
      @Validated @RequestBody CaptureActionRequest request
  );

  @Operation(summary = "Finds a summary of meters captured by day")
  @GetExchange("/stats")
  ResponseEntity<List<CapturedMetersByDay>> getCaptureStats();

}
