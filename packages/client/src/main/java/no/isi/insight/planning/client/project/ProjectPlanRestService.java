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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Project Plans")
@HttpExchange("/api/v1/project-plans")
public interface ProjectPlanRestService {

  @GetExchange
  @Operation(summary = "Lists all project plans for a project")
  ResponseEntity<List<ProjectPlanDetails>> getPlans(
      @RequestParam UUID projectId
  );

  @GetExchange("/{planId}")
  @Operation(summary = "Gets a project plan by id")
  ResponseEntity<ProjectPlanDetails> getPlan(
      @PathVariable UUID planId
  );

  @PostExchange
  @Operation(summary = "Creates a new project plan")
  ResponseEntity<ProjectPlanDetails> createPlan(
      @RequestBody CreateProjectPlanRequest request
  );

  @PutExchange("/{planId}")
  @Operation(summary = "Updates a project plan")
  ResponseEntity<ProjectPlanDetails> updatePlan(
      @PathVariable UUID planId,
      @RequestBody UpdateProjectPlanRequest request
  );

}
