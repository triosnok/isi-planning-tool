package no.isi.insight.planning.file.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.auth.annotation.Authenticated;
import no.isi.insight.planning.client.file.view.FileUploadResponse;
import no.isi.insight.planning.error.model.BadRequestException;
import no.isi.insight.planning.error.model.InternalErrorException;

/**
 * Controller which essentially forwards requests to MinIO, with authz logic as intended. With a
 * proper IdP MinIO might have been used directly, utilizing their external identity plugin along
 * with proper access policies on buckets.
 */
@Slf4j
@RestController
@RequestMapping(FileController.CONTROLLER_PREFIX)
@RequiredArgsConstructor
public class FileController {
  private final MinioClient minioClient;

  public static final String CONTROLLER_PREFIX = "/api/v1/static";

  private static final List<String> ALLOWED_BUCKETS = List.of("vehicles", "users");

  private void ensureBucket(
      String bucket
  ) throws Exception {
    var exists = this.minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());

    if (!exists) {
      this.minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
    }
  }

  @Authenticated
  @GetMapping("/{bucket}/**")
  public StreamingResponseBody get(
      @PathVariable String bucket,
      HttpServletRequest request,
      HttpServletResponse response
  ) {
    if (!ALLOWED_BUCKETS.contains(bucket)) {
      throw new BadRequestException("Invalid bucket");
    }

    var offset = request.getRequestURI().indexOf("/%s/".formatted(bucket));
    var key = request.getRequestURI().substring(offset + bucket.length() + 2);
    var args = GetObjectArgs.builder().bucket(bucket).object(key);

    try {
      var object = this.minioClient.getObject(args.build());

      return out -> {
        object.transferTo(out);
      };
    } catch (Exception e) {
      log.error("Error downloading file: {}", e.getMessage(), e);
      throw new InternalErrorException("Unknown error downloading file");
    }
  }

  @Authenticated
  @PutMapping("/{bucket}/**")
  public FileUploadResponse put(
      @PathVariable String bucket,
      @RequestParam MultipartFile file,
      HttpServletRequest request,
      HttpServletResponse response
  ) {
    if (!ALLOWED_BUCKETS.contains(bucket)) {
      throw new BadRequestException("Invalid bucket");
    }

    var offset = request.getRequestURI().indexOf("/%s/".formatted(bucket));
    var key = request.getRequestURI().substring(offset + bucket.length() + 2);

    try {
      this.ensureBucket(bucket);
      var args = PutObjectArgs.builder().bucket(bucket).object(key).stream(file.getInputStream(), file.getSize(), -1);
      this.minioClient.putObject(args.build());
      return new FileUploadResponse("%s/%s/%s".formatted(CONTROLLER_PREFIX, bucket, key));
    } catch (Exception e) {
      log.error("Error uploading file: {}", e.getMessage(), e);
      throw new InternalErrorException("Unknown error uploading file");
    }
  }

}
