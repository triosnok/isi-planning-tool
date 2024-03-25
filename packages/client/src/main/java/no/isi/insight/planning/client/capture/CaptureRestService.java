package no.isi.insight.planning.client.capture;

import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange("/api/v1/capture")
public interface CaptureRestService {

  @PostExchange(contentType = MediaType.MULTIPART_FORM_DATA_VALUE)
  void uploadLogs(
      @RequestParam UUID tripId,
      @RequestParam MultipartFile gnssLog,
      @RequestParam MultipartFile topCameraLog,
      @RequestParam MultipartFile leftCameraLog,
      @RequestParam MultipartFile rightCameraLog
  );

}
