package no.isi.insight.planning;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.MinIOContainer;
import org.testcontainers.containers.PostgreSQLContainer;

import io.minio.MinioClient;

@TestConfiguration(proxyBeanMethods = false)
public class IntegrationTestConfiguration {

  @Bean
  @ServiceConnection
  @SuppressWarnings("resource")
  PostgreSQLContainer<?> postgresContainer() {
    return new PostgreSQLContainer<>(TestcontainersConfiguration.POSTGIS_IMAGE_NAME).withReuse(true);
  }

  @Bean(initMethod = "start", destroyMethod = "stop")
  MinIOContainer minioContainer() {
    return new MinIOContainer("minio/minio:RELEASE.2024-03-21T23-13-43Z");
  }

  @Bean
  @ConditionalOnProperty(name = "no.isi.insight.planning.integration.minio.url", matchIfMissing = true)
  MinioClient minioClient(
      MinIOContainer container
  ) {
    return MinioClient.builder()
      .endpoint(container.getS3URL())
      .credentials(container.getUserName(), container.getPassword())
      .build();
  }

}
