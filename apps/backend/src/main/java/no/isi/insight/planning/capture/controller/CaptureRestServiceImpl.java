package no.isi.insight.planning.capture.controller;

import java.nio.file.Files;
import java.util.Map;
import java.util.UUID;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planner.client.capture.CaptureRestService;
import no.isi.insight.planner.client.trip.view.CameraPosition;
import no.isi.insight.planning.capture.service.CaptureLogProcessor;
import no.isi.insight.planning.repository.TripRailingCaptureJdbcRepository;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CaptureRestServiceImpl implements CaptureRestService {
  private final CaptureLogProcessor logProcessor;
  private final TripRailingCaptureJdbcRepository railingCaptureJdbcRepository;

  @Override
  public void uploadLogs(
      UUID tripId,
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
      this.railingCaptureJdbcRepository.saveRailingCapture(tripId, logEntries);

      gnssLogTemp.delete();
      topCameraLogTemp.delete();
      leftCameraLogTemp.delete();
      rightCameraLogTemp.delete();

    } catch (Exception e) {
      e.printStackTrace();
    }
  }

}
