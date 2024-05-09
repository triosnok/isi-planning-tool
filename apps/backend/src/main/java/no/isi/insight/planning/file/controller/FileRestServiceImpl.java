package no.isi.insight.planning.file.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.auth.annotation.Authenticated;
import no.isi.insight.planning.client.file.FileRestService;
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
@RequiredArgsConstructor
public class FileRestServiceImpl implements FileRestService {
  private final MinioClient minioClient;

  private static final List<String> ALLOWED_BUCKETS = List.of("vehicles", "users");

  private void ensureBucket(
      String bucket
  ) throws Exception {
    var exists = this.minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());

    if (!exists) {
      this.minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
    }
  }

  @Override
  @Authenticated
  public StreamingResponseBody get(
      String bucket,
      String key
  ) {
    if (!ALLOWED_BUCKETS.contains(bucket)) {
      throw new BadRequestException("Invalid bucket");
    }

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

  @Override
  @Authenticated
  public FileUploadResponse upload(
      String bucket,
      MultipartFile file
  ) {
    if (!ALLOWED_BUCKETS.contains(bucket)) {
      throw new BadRequestException("Invalid bucket");
    }

    // random file key is generated to avoid collisions
    var key = UUID.randomUUID().toString();

    try {
      this.ensureBucket(bucket);
      var args = PutObjectArgs.builder().bucket(bucket).object(key).stream(file.getInputStream(), file.getSize(), -1);
      this.minioClient.putObject(args.build());
      return new FileUploadResponse("%s/%s/%s".formatted(FileRestService.PREFIX, bucket, key));
    } catch (Exception e) {
      log.error("Error uploading file: {}", e.getMessage(), e);
      throw new InternalErrorException("Unknown error uploading file");
    }
  }

}
