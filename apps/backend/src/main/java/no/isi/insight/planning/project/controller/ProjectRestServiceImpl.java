package no.isi.insight.planning.project.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.client.project.ProjectRestService;
import no.isi.insight.planning.client.project.view.CreateProjectRequest;
import no.isi.insight.planning.client.project.view.ProjectDetails;
import no.isi.insight.planning.client.project.view.ProjectStatus;
import no.isi.insight.planning.client.project.view.RoadRailing;
import no.isi.insight.planning.model.Project;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.repository.ProjectJdbcRepository;
import no.isi.insight.planning.repository.ProjectJpaRepository;
import no.isi.insight.planning.repository.RoadRailingJdbcRepository;

@RestController
@RequiredArgsConstructor
public class ProjectRestServiceImpl implements ProjectRestService {
  private final RoadRailingJdbcRepository roadRailingJdbcRepository;
  private final ProjectJpaRepository projectJpaRepository;
  private final ProjectJdbcRepository projectJdbcRepository;

  @Override
  public ResponseEntity<ProjectDetails> createProject(
      CreateProjectRequest request
  ) {

    Project project = new Project(
      request.name(),
      request.referenceCode(),
      request.startsAt(),
      request.endsAt()
    );

    var savedProject = this.projectJpaRepository.save(project);

    var details = this.projectJdbcRepository.findById(savedProject.getId());

    return ResponseEntity.ok(details.get());
  }

  @Override
  public ResponseEntity<List<RoadRailing>> getRailings(
      UUID projectId,
      Optional<UUID> planId,
      Optional<UUID> tripId,
      Optional<Boolean> hideCompleted
  ) {
    var railings = this.roadRailingJdbcRepository.getRailings(projectId, planId, tripId, hideCompleted.orElse(false));
    return ResponseEntity.ok(railings);
  }

  @Override
  public ResponseEntity<ProjectDetails> getProject(
      UUID projectId
  ) {
    var project = this.projectJdbcRepository.findById(projectId)
      .orElseThrow(() -> new NotFoundException("Project not found"));
    return ResponseEntity.ok(project);
  }

  @Override
  public ResponseEntity<List<ProjectDetails>> getProjects(
      Optional<ProjectStatus> status
  ) {
    var projects = this.projectJdbcRepository.findProjects(status);
    return ResponseEntity.ok(projects);
  }
}
