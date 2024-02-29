package no.isi.insight.planning.project.controller;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planner.client.project.ProjectPlanRestService;
import no.isi.insight.planner.client.project.view.CreateProjectPlanRequest;
import no.isi.insight.planning.geometry.GeometryService;
import no.isi.insight.planning.integration.nvdb.RailingImportService;
import no.isi.insight.planning.model.ProjectPlan;
import no.isi.insight.planning.model.RoadRailing;
import no.isi.insight.planning.repository.ProjectJpaRepository;
import no.isi.insight.planning.repository.ProjectPlanJpaRepository;
import no.isi.insight.planning.repository.RoadRailingJpaRepository;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ProjectPlanRestServiceImpl implements ProjectPlanRestService {
  private final RailingImportService railingImportService;
  private final RoadRailingJpaRepository railingJpaRepository;
  private final ProjectJpaRepository projectJpaRepository;
  private final ProjectPlanJpaRepository projectPlanJpaRepository;
  private final GeometryService geometryService;

  @Override
  public ResponseEntity<Object> createPlan(
      UUID projectId,
      CreateProjectPlanRequest request
  ) {
    var project = this.projectJpaRepository.findById(projectId)
      .orElseThrow(() -> new RuntimeException("Project not found"));
    var railings = this.railingImportService.importRailings(request.importUrl());

    var mappedRailings = new ArrayList<RoadRailing>();
    var importUrls = new ArrayList<String>();
    importUrls.add(request.importUrl());

    var plan = new ProjectPlan(
      project,
      importUrls,
      request.startsAt(),
      request.endsAt()
    );

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

    return ResponseEntity.ok(savedPlan.getId());
  }

}
