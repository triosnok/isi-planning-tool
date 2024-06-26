package no.isi.insight.planning;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.devtools.restart.RestartScope;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.MinIOContainer;
import org.testcontainers.containers.PostgreSQLContainer;

import io.minio.MinioClient;
import no.isi.insight.planning.auth.service.UserAccountService;
import no.isi.insight.planning.db.model.UserAccountRole;
import no.isi.insight.planning.db.repository.UserAccountJpaRepository;

@TestConfiguration(proxyBeanMethods = false)
public class PlanningApplicationDevelopment {

  @Bean
  @RestartScope
  @ServiceConnection
  PostgreSQLContainer<?> postgresContainer() {
    return new PostgreSQLContainer<>(TestcontainersConfiguration.POSTGIS_IMAGE_NAME);
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

  public static void main(
      String[] args
  ) {
    SpringApplication.from(PlanningApplication::main).with(PlanningApplicationDevelopment.class).run(args);
  }

  @Bean
  boolean init(
      UserAccountService userService,
      UserAccountJpaRepository userRepository
  ) {
    if (userRepository.findByEmail("dev@email.invalid").isEmpty()) {
      userService.createAccount("Developer", "dev@email.invalid", "57b114ab-0f6f-4dc8-9ead-3963d00b67f1", null, "dev", UserAccountRole.PLANNER);
    }

    return true;
  }

}
