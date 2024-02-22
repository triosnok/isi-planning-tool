package no.isi.insight.planning.project.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.project.ProjectRestService;
import no.isi.insight.planner.client.project.view.RoadRailing;
import no.isi.insight.planning.repository.RoadRailingJdbcRepository;

@RestController
@RequiredArgsConstructor
public class ProjectRestServiceImpl implements ProjectRestService {
  private final RoadRailingJdbcRepository roadRailingJdbcRepository;

  @Override
  public ResponseEntity<List<RoadRailing>> getRailings(
      UUID projectId,
      Optional<UUID> planId,
      Optional<UUID> tripId
  ) {
    var railings = this.roadRailingJdbcRepository.getRailings(projectId, planId, tripId);
    return ResponseEntity.ok(railings);
  }
}
