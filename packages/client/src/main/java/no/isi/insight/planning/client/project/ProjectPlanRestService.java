package no.isi.insight.planning.client.project;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.project.view.CreateProjectPlanRequest;
import no.isi.insight.planning.client.project.view.ProjectPlanDetails;
import no.isi.insight.planning.client.project.view.UpdateProjectPlanRequest;

@Tag(name = "Project Plans", description = "Operations on the collection of project plans")
@HttpExchange("/api/v1/project-plans")
public interface ProjectPlanRestService {

  @GetExchange
  @Operation(summary = "Lists all project plans for a project")
  ResponseEntity<List<ProjectPlanDetails>> getPlans(
      @RequestParam UUID projectId
  );

  @GetExchange("/{planId}")
  @Operation(summary = "Finds a project plan by id")
  ResponseEntity<ProjectPlanDetails> getPlan(
      @PathVariable UUID planId
  );

  @PostExchange
  @Operation(summary = "Creates a new project plan")
  ResponseEntity<ProjectPlanDetails> createPlan(
      @Validated @RequestBody CreateProjectPlanRequest request
  );

  @PutExchange("/{planId}")
  @Operation(summary = "Updates a project plan")
  ResponseEntity<ProjectPlanDetails> updatePlan(
      @PathVariable UUID planId,
      @Validated @RequestBody UpdateProjectPlanRequest request
  );
}
