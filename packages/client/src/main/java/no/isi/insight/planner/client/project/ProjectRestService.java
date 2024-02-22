package no.isi.insight.planner.client.project;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import no.isi.insight.planner.client.project.view.CreateProjectRequest;
import no.isi.insight.planner.client.project.view.ProjectDetails;
import no.isi.insight.planner.client.project.view.RoadRailing;

@HttpExchange("/api/v1/projects")
public interface ProjectRestService {

  /**
   * Finds a list of railings within a project based on the given criteria.
   * 
   * @param projectId the id of the project to find railings for
   * @param planId    optionally, the id of the plan within a project to find railings for
   * @param tripId    optionally, the id of the trip within a plan to find railings for
   * 
   * @return a list of railings
   */
  @GetExchange("/{projectId}/railings")
  ResponseEntity<List<RoadRailing>> getRailings(
      @PathVariable UUID projectId,
      @RequestParam Optional<UUID> planId,
      @RequestParam Optional<UUID> tripId
  );

  /**
   * Creates a new project with the given details.
   * 
   * @param request the details of the project to create
   */
  @PostExchange
  ResponseEntity<ProjectDetails> createProject(
      @RequestBody CreateProjectRequest request
  );

  /**
   * Get a list of all projects.
   */
  @GetExchange
  ResponseEntity<List<ProjectDetails>> getProjects();

  /**
   * Get a project by its id.
   * 
   * @param projectId the id of the project to find
   */
  @GetExchange("/{projectId}")
  ResponseEntity<ProjectDetails> getProject(
      @PathVariable UUID projectId
  );
}
