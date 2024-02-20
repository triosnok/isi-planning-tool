package no.isi.insight.planning;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.PostgreSQLContainer;

@TestConfiguration(proxyBeanMethods = false)
public class IntegrationTestConfiguration {

  @Bean
  @ServiceConnection
  @SuppressWarnings("resource")
  PostgreSQLContainer<?> postgresContainer() {
    return new PostgreSQLContainer<>(TestcontainersConfiguration.POSTGIS_IMAGE_NAME).withReuse(true);
  }

}
