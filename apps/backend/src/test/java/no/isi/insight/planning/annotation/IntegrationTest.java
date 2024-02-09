package no.isi.insight.planning.annotation;

import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

import no.isi.insight.planning.IntegrationTestConfiguration;
import no.isi.insight.planning.PlanningApplication;

@Inherited
@Retention(RetentionPolicy.RUNTIME)
@AutoConfigureMockMvc
@Import(IntegrationTestConfiguration.class)
@SpringBootTest(classes = PlanningApplication.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public @interface IntegrationTest {}
