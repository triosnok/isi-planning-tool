package no.isi.insight.planning.project.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.auth.annotation.PlannerAuthorization;
import no.isi.insight.planning.client.project.ProjectRestService;
import no.isi.insight.planning.client.project.view.CreateProjectRequest;
import no.isi.insight.planning.client.project.view.ProjectDetails;
import no.isi.insight.planning.client.project.view.ProjectStatus;
import no.isi.insight.planning.client.project.view.UpdateProjectRequest;
import no.isi.insight.planning.db.model.Project;
import no.isi.insight.planning.db.repository.ProjectJdbcRepository;
import no.isi.insight.planning.db.repository.ProjectJpaRepository;
import no.isi.insight.planning.error.model.NotFoundException;

@RestController
@RequiredArgsConstructor
public class ProjectRestServiceImpl implements ProjectRestService {
  private final ProjectJpaRepository projectJpaRepository;
  private final ProjectJdbcRepository projectJdbcRepository;

  @Override
  @PlannerAuthorization
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
  @DriverAuthorization
  public ResponseEntity<ProjectDetails> getProject(
      UUID projectId
  ) {
    var project = this.projectJdbcRepository.findById(projectId)
      .orElseThrow(() -> new NotFoundException("Project not found"));
    return ResponseEntity.ok(project);
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<ProjectDetails>> getProjects(
      Optional<ProjectStatus> status
  ) {
    var projects = this.projectJdbcRepository.findProjects(status);
    return ResponseEntity.ok(projects);
  }

  @Override
  @PlannerAuthorization
  public ResponseEntity<ProjectDetails> updateProject(
      UUID projectId,
      UpdateProjectRequest request
  ) {
    var project = this.projectJpaRepository.findById(projectId)
      .orElseThrow(() -> new NotFoundException("Project not found"));

    project.setName(request.name());
    project.setReferenceCode(request.referenceCode());
    project.setStartsAt(request.startsAt());
    project.setEndsAt(request.endsAt());

    var updatedProject = this.projectJpaRepository.save(project);

    var projectDetails = this.projectJdbcRepository.findById(updatedProject.getId());

    return ResponseEntity.ok(projectDetails.get());
  }
}
