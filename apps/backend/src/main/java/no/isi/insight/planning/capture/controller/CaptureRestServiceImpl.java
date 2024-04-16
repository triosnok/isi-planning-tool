package no.isi.insight.planning.capture.controller;

import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.auth.annotation.PlannerAuthorization;
import no.isi.insight.planning.capture.service.CaptureLogProcessor;
import no.isi.insight.planning.capture.service.CaptureReplayFileService;
import no.isi.insight.planning.capture.service.CaptureReplayService;
import no.isi.insight.planning.client.capture.CaptureRestService;
import no.isi.insight.planning.client.capture.view.CaptureActionRequest;
import no.isi.insight.planning.client.capture.view.CaptureLogDetails;
import no.isi.insight.planning.client.trip.view.CameraPosition;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.repository.TripJpaRepository;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CaptureRestServiceImpl implements CaptureRestService {
  private final CaptureLogProcessor logProcessor;
  private final TripJpaRepository tripJpaRepository;
  private final CaptureReplayFileService captureReplayFileService;
  private final CaptureReplayService captureReplayService;

  @Override
  @PlannerAuthorization
  public void uploadLogs(
      String logIdentifier,
      MultipartFile gnssLog,
      MultipartFile topCameraLog,
      MultipartFile leftCameraLog,
      MultipartFile rightCameraLog
  ) {
    try {
      var gnssLogTemp = Files.createTempFile("gnssLog", ".log").toFile();
      gnssLog.transferTo(gnssLogTemp);

      var topCameraLogTemp = Files.createTempFile("topCameraLog", ".log").toFile();
      topCameraLog.transferTo(topCameraLogTemp);

      var leftCameraLogTemp = Files.createTempFile("leftCameraLog", ".log").toFile();
      leftCameraLog.transferTo(leftCameraLogTemp);

      var rightCameraLogTemp = Files.createTempFile("rightCameraLog", ".log").toFile();
      rightCameraLog.transferTo(rightCameraLogTemp);

      log.info(
        "Temp files: {}, {}, {}, {}",
        gnssLogTemp.getPath(),
        topCameraLogTemp.getPath(),
        leftCameraLogTemp.getPath(),
        rightCameraLogTemp.getPath()
      );

      var cameraLogs = Map.of(
        CameraPosition.TOP,
        topCameraLogTemp,
        CameraPosition.LEFT,
        leftCameraLogTemp,
        CameraPosition.RIGHT,
        rightCameraLogTemp
      );

      var logEntries = this.logProcessor.processLogs(gnssLogTemp, cameraLogs);

      gnssLogTemp.delete();
      topCameraLogTemp.delete();
      leftCameraLogTemp.delete();
      rightCameraLogTemp.delete();

      this.captureReplayFileService.saveCapture(logIdentifier, logEntries);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  @Override
  @DriverAuthorization
  public List<CaptureLogDetails> getCaptureLogs() {
    return this.captureReplayFileService.listCaptures();
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<Void> captureAction(
      CaptureActionRequest request
  ) {
    if (!this.captureReplayService.hasTrip(request.tripId())) {
      throw new NotFoundException("No ongoing capture");
    }

    switch (request.action()) {
      case RESUME -> this.captureReplayService.resumeReplay(request.tripId());
      case PAUSE -> this.captureReplayService.pauseReplay(request.tripId());
    }

    return ResponseEntity.ok().build();
  }

  @Override
  @DriverAuthorization
  public SseEmitter streamCapture(
      UUID tripId
  ) {
    this.tripJpaRepository.findById(tripId).orElseThrow(() -> new NotFoundException("Trip not found"));

    if (!this.captureReplayService.hasTrip(tripId)) {
      var emitter = new SseEmitter();

      try {
        emitter.send(SseEmitter.event().name("ended").build());
      } catch (Exception e) {
        // failed to send event
      }

      emitter.complete();

      return emitter;
    }

    var emitter = this.captureReplayService.createEmitter(tripId);

    return emitter;
  }

}
