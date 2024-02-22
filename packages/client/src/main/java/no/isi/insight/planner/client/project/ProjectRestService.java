package no.isi.insight.planner.client.project;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import no.isi.insight.planner.client.project.view.RoadRailing;

@HttpExchange("/api/v1/project")
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

}
