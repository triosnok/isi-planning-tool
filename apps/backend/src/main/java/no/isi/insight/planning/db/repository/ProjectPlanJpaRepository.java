package no.isi.insight.planning.db.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

import no.isi.insight.planning.db.model.ProjectPlan;

public interface ProjectPlanJpaRepository extends Repository<ProjectPlan, UUID> {
  
  @Transactional(readOnly = false)
  ProjectPlan save(ProjectPlan plan);

  Optional<ProjectPlan> findById(UUID id);

}
