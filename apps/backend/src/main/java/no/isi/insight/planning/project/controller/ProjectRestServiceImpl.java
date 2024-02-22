package no.isi.insight.planning.project.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.project.ProjectRestService;
import no.isi.insight.planner.client.project.view.CreateProjectRequest;
import no.isi.insight.planner.client.project.view.ProjectDetails;
import no.isi.insight.planner.client.project.view.RoadRailing;
import no.isi.insight.planning.model.Project;
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

    return ResponseEntity.ok(
      new ProjectDetails(
        savedProject.getId(),
        savedProject.getName(),
        savedProject.getReferenceCode(),
        savedProject.getStartsAt(),
        savedProject.getEndsAt()
      )
    );
  }

  @Override
  public ResponseEntity<List<RoadRailing>> getRailings(
      UUID projectId,
      Optional<UUID> planId,
      Optional<UUID> tripId
  ) {
    var railings = this.roadRailingJdbcRepository.getRailings(projectId, planId, tripId);
    return ResponseEntity.ok(railings);
  }

  @Override
  public ResponseEntity<ProjectDetails> getProject(
      UUID projectId
  ) {
    var project = this.projectJpaRepository.findById(projectId);
    return ResponseEntity.ok(
      new ProjectDetails(
        project.getId(),
        project.getName(),
        project.getReferenceCode(),
        project.getStartsAt(),
        project.getEndsAt()
      )
    );
  }

  @Override
  public ResponseEntity<List<ProjectDetails>> getProjects() {
    var projects = this.projectJdbcRepository.findProjects();
    return ResponseEntity.ok(projects);
  }
}
