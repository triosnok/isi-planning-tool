package no.isi.insight.planning.project.controller;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planner.client.project.ProjectPlanRestService;
import no.isi.insight.planner.client.project.view.CreateProjectPlanRequest;
import no.isi.insight.planner.client.project.view.ProjectPlanDetails;
import no.isi.insight.planner.client.project.view.UpdateProjectPlanRequest;
import no.isi.insight.planning.geometry.GeometryService;
import no.isi.insight.planning.integration.nvdb.RailingImportService;
import no.isi.insight.planning.model.ProjectPlan;
import no.isi.insight.planning.model.RoadRailing;
import no.isi.insight.planning.model.Vehicle;
import no.isi.insight.planning.repository.ProjectJpaRepository;
import no.isi.insight.planning.repository.ProjectPlanJdbcRepository;
import no.isi.insight.planning.repository.ProjectPlanJpaRepository;
import no.isi.insight.planning.repository.RoadRailingJpaRepository;
import no.isi.insight.planning.repository.VehicleJpaRepository;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ProjectPlanRestServiceImpl implements ProjectPlanRestService {
  private final RailingImportService railingImportService;
  private final RoadRailingJpaRepository railingJpaRepository;
  private final ProjectJpaRepository projectJpaRepository;
  private final ProjectPlanJpaRepository projectPlanJpaRepository;
  private final ProjectPlanJdbcRepository projectPlanJdbcRepository;
  private final VehicleJpaRepository vehicleJpaRepository;
  private final GeometryService geometryService;

  @Override
  public ResponseEntity<ProjectPlanDetails> createPlan(
      UUID projectId,
      CreateProjectPlanRequest request
  ) {
    var project = this.projectJpaRepository.findById(projectId)
      .orElseThrow(() -> new RuntimeException("Project not found"));
    var railings = this.railingImportService.importRailings(request.importUrl());
    Optional<Vehicle> vehicle = Optional.empty();

    if (request.vehicleId().isEmpty()) {
      var vehicleId = request.vehicleId().get();
      vehicle = Optional.of(this.vehicleJpaRepository.findById(vehicleId).orElseThrow(() -> new RuntimeException("")));
    }

    var mappedRailings = new ArrayList<RoadRailing>();
    var importUrls = new ArrayList<String>();
    importUrls.add(request.importUrl());

    var plan = new ProjectPlan(
      project,
      importUrls,
      request.startsAt(),
      request.endsAt()
    );

    vehicle.ifPresent(plan::setVehicle);

    for (var railing : railings) {
      try {
        var ls = this.geometryService.parseLineString(railing.geometry().wkt())
          .orElseThrow(() -> new RuntimeException("Unexpected linestring parsing error"));

        var roadSystemReference = railing.location().roadSystemReferences().get(0);
        var placement = railing.location().placements().stream().findFirst();

        var mapped = new RoadRailing(
          railing.id(),
          ls,
          roadSystemReference.system().id(),
          roadSystemReference.shortform(),
          railing.location().length(),
          placement.map(p -> p.getDirection()).orElse(null),
          placement.map(p -> p.getSide()).orElse(null)
        );

        mappedRailings.add(mapped);
      } catch (Exception e) {
        log.error("Failed to map railing with id: {}", railing.id());
      }
    }

    var savedRailings = this.railingJpaRepository.saveAll(mappedRailings);
    savedRailings.forEach(plan::addRailing);
    var savedPlan = this.projectPlanJpaRepository.save(plan);
    var planDetails = this.projectPlanJdbcRepository.findPlanDetailsById(savedPlan.getId());

    return ResponseEntity.ok(planDetails.get());
  }

  @Override
  public ResponseEntity<ProjectPlanDetails> updatePlan(
      UUID planId,
      UpdateProjectPlanRequest request
  ) {
    var plan = this.projectPlanJpaRepository.findById(planId).orElseThrow();
    Optional<Vehicle> vehicle = Optional.empty();

    if (request.vehicleId().isEmpty()) {
      var vehicleId = request.vehicleId().get();
      vehicle = Optional.of(this.vehicleJpaRepository.findById(vehicleId).orElseThrow(() -> new RuntimeException("")));
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
    var details = this.projectPlanJdbcRepository.findPlanDetailsById(planId);

    return ResponseEntity.ok(details.get());
  }

}
