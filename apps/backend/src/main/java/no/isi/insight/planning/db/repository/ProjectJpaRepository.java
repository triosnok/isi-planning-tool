package no.isi.insight.planning.db.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.Repository;

import no.isi.insight.planning.db.model.Project;

public interface ProjectJpaRepository extends Repository<Project, UUID> {

  Project save(
      Project project
  );

  Optional<Project> findById(
      UUID id
  );
}
