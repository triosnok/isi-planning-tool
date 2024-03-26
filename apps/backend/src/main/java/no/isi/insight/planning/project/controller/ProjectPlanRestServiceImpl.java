package no.isi.insight.planning.project.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.auth.annotation.PlannerAuthorization;
import no.isi.insight.planning.client.project.ProjectPlanRestService;
import no.isi.insight.planning.client.project.view.CreateProjectPlanRequest;
import no.isi.insight.planning.client.project.view.ProjectPlanDetails;
import no.isi.insight.planning.client.project.view.UpdateProjectPlanRequest;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.model.ProjectPlan;
import no.isi.insight.planning.model.Vehicle;
import no.isi.insight.planning.project.service.RailingImportService;
import no.isi.insight.planning.repository.ProjectJpaRepository;
import no.isi.insight.planning.repository.ProjectPlanJdbcRepository;
import no.isi.insight.planning.repository.ProjectPlanJpaRepository;
import no.isi.insight.planning.repository.VehicleJpaRepository;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ProjectPlanRestServiceImpl implements ProjectPlanRestService {
  private final RailingImportService railingImportService;
  private final ProjectJpaRepository projectJpaRepository;
  private final ProjectPlanJpaRepository projectPlanJpaRepository;
  private final ProjectPlanJdbcRepository projectPlanJdbcRepository;
  private final VehicleJpaRepository vehicleJpaRepository;

  @Override
  @DriverAuthorization
  public ResponseEntity<List<ProjectPlanDetails>> getPlans(
      UUID projectId
  ) {
    return ResponseEntity.ok(this.projectPlanJdbcRepository.findByProjectId(projectId));
  }

  @Override
  public ResponseEntity<ProjectPlanDetails> getPlan(
      UUID planId
  ) {
    var plan = this.projectPlanJdbcRepository.findById(planId)
      .orElseThrow(() -> new NotFoundException("Could not find a plan with id: " + planId));

    return ResponseEntity.ok(plan);
  }

  @Override
  @PlannerAuthorization
  public ResponseEntity<ProjectPlanDetails> createPlan(
      CreateProjectPlanRequest request
  ) {
    var project = this.projectJpaRepository.findById(request.projectId())
      .orElseThrow(() -> new RuntimeException("Project not found"));
    Optional<Vehicle> vehicle = Optional.empty();

    if (request.vehicleId() != null) {
      vehicle = Optional.of(
        this.vehicleJpaRepository.findById(request.vehicleId())
          .orElseThrow(() -> new NotFoundException("Could not find vehicle with id: " + request.vehicleId()))
      );
    }

    var importUrls = new ArrayList<String>();
    importUrls.add(request.importUrl());

    var plan = new ProjectPlan(
      project,
      importUrls,
      request.startsAt(),
      request.endsAt()
    );

    vehicle.ifPresent(plan::setVehicle);

    var railings = this.railingImportService.importRailings(request.importUrl());
    railings.forEach(plan::addRailing);
    var savedPlan = this.projectPlanJpaRepository.save(plan);
    var planDetails = this.projectPlanJdbcRepository.findById(savedPlan.getId());

    return ResponseEntity.ok(planDetails.get());
  }

  @Override
  @PlannerAuthorization
  public ResponseEntity<ProjectPlanDetails> updatePlan(
      UUID planId,
      UpdateProjectPlanRequest request
  ) {
    var plan = this.projectPlanJpaRepository.findById(planId).orElseThrow();
    Optional<Vehicle> vehicle = Optional.empty();

    if (request.vehicleId() != null) {
      vehicle = Optional
        .of(this.vehicleJpaRepository.findById(request.vehicleId()).orElseThrow(() -> new RuntimeException("")));
    }

    vehicle.ifPresent(plan::setVehicle);

    plan.setStartsAt(request.startsAt());
    plan.setEndsAt(request.endsAt());

    if (request.importUrl() != null) {
      log.info("Re-importing railings for plan with id: {}", planId);
      plan.addRailingImportUrl(request.importUrl());
      // TODO: re-import railings
    }

    this.projectPlanJpaRepository.save(plan);
    var details = this.projectPlanJdbcRepository.findById(planId);

    return ResponseEntity.ok(details.get());
  }

}
