package no.isi.insight.planning.init;

import javax.sql.DataSource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import liquibase.integration.spring.SpringLiquibase;
import lombok.RequiredArgsConstructor;

@SpringBootApplication
@RequiredArgsConstructor
public class PlanningInitApplication {
  private final DataSource dataSource;

  public static void main(String[] args) {
    SpringApplication.run(PlanningInitApplication.class, args);
  }

  @Bean
  SpringLiquibase liquibase() {
    var liquibase = new SpringLiquibase();
    liquibase.setChangeLog("classpath:db/changelog/db.changelog-master.yaml");
    liquibase.setDataSource(this.dataSource);
    return liquibase;
  }

}
