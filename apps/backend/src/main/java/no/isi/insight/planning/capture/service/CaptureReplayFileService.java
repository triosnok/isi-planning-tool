package no.isi.insight.planning.capture.service;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.ListObjectsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.capture.model.ProcessedLogEntry;

@Slf4j
@Service
@RequiredArgsConstructor
public class CaptureReplayFileService {
  private final MinioClient minio;
  private final ObjectMapper objectMapper;

  private static final String BUCKET_NAME = "capture";

  private void ensureBucket() throws Exception {
    var exists = this.minio.bucketExists(BucketExistsArgs.builder().bucket(BUCKET_NAME).build());

    if (!exists) {
      this.minio.makeBucket(MakeBucketArgs.builder().bucket(BUCKET_NAME).build());
    }
  }

  /**
   * Lists the captures stored in object storage.
   * 
   * @return the list of capture identifiers
   */
  public List<String> listCaptures() {
    var request = ListObjectsArgs.builder().bucket(BUCKET_NAME).build();
    var results = new ArrayList<String>();
    var it = this.minio.listObjects(request).iterator();

    try {
      while (it.hasNext()) {
        var item = it.next().get();
        results.add(item.objectName());
      }
    } catch (Exception e) {
      // TODO: handle exception
    }

    return results;
  }

  /**
   * Saves the processed capture log entries to object storage.
   * 
   * @param identifier the identifier of the capture log
   * @param entries    the processed log entries
   */
  public void saveCapture(
      String identifier,
      List<ProcessedLogEntry> entries
  ) {
    try {
      var file = File.createTempFile("processed-%s".formatted(identifier), "log");
      var writer = this.objectMapper.writerFor(ProcessedLogEntry.class).writeValues(file);

      writer.writeAll(entries);

      this.ensureBucket();

      var request = PutObjectArgs.builder()
        .bucket(BUCKET_NAME)
        .object(identifier)
        .stream(new FileInputStream(file), file.length(), -1)
        .build();

      this.minio.putObject(request);
    } catch (Exception e) {
      log.error("Failed to save capture log to bucket: {}", e.getMessage());
    }
  }

  /**
   * Retrieves the processed capture log entries from object storage.
   * 
   * @param identifier the identifier of the capture log
   * 
   * @return the processed log entries
   */
  public List<ProcessedLogEntry> getCapture(
      String identifier
  ) {
    var request = GetObjectArgs.builder().bucket(BUCKET_NAME).object(identifier).build();

    try (var response = this.minio.getObject(request)) {
      MappingIterator<ProcessedLogEntry> logIterator = this.objectMapper.readerFor(ProcessedLogEntry.class)
        .readValues(response);

      return logIterator.readAll();
    } catch (Exception e) {
      log.error("Failed to read capture log from bucket: {}", e.getMessage());
      throw new IllegalStateException(e);
    }
  }

}
