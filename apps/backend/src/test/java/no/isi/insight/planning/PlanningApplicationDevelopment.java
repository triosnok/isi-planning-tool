package no.isi.insight.planning;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.devtools.restart.RestartScope;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import no.isi.insight.planning.auth.service.UserAccountService;
import no.isi.insight.planning.model.UserAccountRole;

@TestConfiguration(proxyBeanMethods = false)
public class PlanningApplicationDevelopment {

  @Bean
  @RestartScope
  @ServiceConnection
  PostgreSQLContainer<?> postgresContainer() {
    return new PostgreSQLContainer<>(DockerImageName.parse("postgres:latest"));
  }

  public static void main(
      String[] args
  ) {
    SpringApplication.from(PlanningApplication::main).with(PlanningApplicationDevelopment.class).run(args);
  }

  @Bean
  boolean init(
      UserAccountService userService
  ) {
    userService.createAccount("Developer", "dev@email.invalid", null, "dev", UserAccountRole.PLANNER);
    return true;
  }

}
