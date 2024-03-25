package no.isi.insight.planning.client.project;

import java.util.UUID;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import no.isi.insight.planning.client.project.view.CreateProjectPlanRequest;
import no.isi.insight.planning.client.project.view.ProjectPlanDetails;
import no.isi.insight.planning.client.project.view.UpdateProjectPlanRequest;

@HttpExchange("/api/v1/project-plans")
public interface ProjectPlanRestService {

  @GetExchange
  ResponseEntity<List<ProjectPlanDetails>> getPlans(
      @RequestParam UUID projectId
  );

  @GetExchange("/{planId}")
  ResponseEntity<ProjectPlanDetails> getPlan(
      @PathVariable UUID planId
  );

  @PostExchange
  ResponseEntity<ProjectPlanDetails> createPlan(
      @RequestBody CreateProjectPlanRequest request
  );

  @PutExchange("/{planId}")
  ResponseEntity<ProjectPlanDetails> updatePlan(
      @PathVariable UUID planId,
      @RequestBody UpdateProjectPlanRequest request
  );

}
