package no.isi.insight.planning.client.file;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import no.isi.insight.planning.client.file.view.FileUploadResponse;

@HttpExchange(FileRestService.PREFIX)
public interface FileRestService {

  public static final String PREFIX = "/api/v1/file";

  @GetExchange("/{bucket}/{key}")
  public StreamingResponseBody get(
      @PathVariable String bucket,
      @PathVariable String key
  );

  @PostExchange(value = "/{bucket}")
  public FileUploadResponse upload(
      @PathVariable String bucket,
      @RequestParam MultipartFile file
  );

}
