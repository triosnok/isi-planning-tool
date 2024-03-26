package no.isi.insight.planning.integration.minio;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.minio.MinioClient;

@Configuration
public class MinioConfig {

  @Bean
  @ConditionalOnProperty(name = "no.isi.insight.planning.integration.minio.url")
  MinioClient minioClient(
      MinioProperties properties
  ) {
    return MinioClient.builder()
      .endpoint(properties.url())
      .credentials(properties.accessKey(), properties.secretKey())
      .build();
  }

}
