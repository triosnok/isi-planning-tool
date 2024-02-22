package no.isi.insight.planner.client.project;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import no.isi.insight.planner.client.project.view.CreateProjectPlanRequest;

@HttpExchange("/api/v1/projects/{projectId}/plans")
public interface ProjectPlanRestService {

  @PostExchange
  ResponseEntity<Object> createPlan(
      @PathVariable UUID projectId,
      @RequestBody CreateProjectPlanRequest request
  );

}
