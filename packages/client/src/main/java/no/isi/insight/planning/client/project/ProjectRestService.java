package no.isi.insight.planning.client.project;

import java.util.List;
import java.util.Optional;
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
import no.isi.insight.planning.client.project.view.CreateProjectRequest;
import no.isi.insight.planning.client.project.view.ProjectDetails;
import no.isi.insight.planning.client.project.view.ProjectStatus;
import no.isi.insight.planning.client.project.view.UpdateProjectRequest;

@Tag(name = "Projects", description = "Operations on the collection of projects")
@HttpExchange("/api/v1/projects")
public interface ProjectRestService {

  /**
   * Creates a new project with the given details.
   * 
   * @param request the details of the project to create
   */
  @Operation(summary = "Creates a new project")
  @PostExchange
  ResponseEntity<ProjectDetails> createProject(
      @Validated @RequestBody CreateProjectRequest request
  );

  /**
   * Get a list of all projects.
   */
  @Operation(summary = "Lists projects with optional status filtering")
  @GetExchange
  ResponseEntity<List<ProjectDetails>> getProjects(
      @RequestParam Optional<ProjectStatus> status
  );

  /**
   * Get a project by its id.
   * 
   * @param projectId the id of the project to find
   */
  @Operation(summary = "Finds a project by its id")
  @GetExchange("/{projectId}")
  ResponseEntity<ProjectDetails> getProject(
      @PathVariable UUID projectId
  );

  @Operation(summary = "Updates a projects details")
  @PutExchange("/{projectId}")
  ResponseEntity<ProjectDetails> updateProject(
      @PathVariable UUID projectId,
      @Validated @RequestBody UpdateProjectRequest request
  );

}
