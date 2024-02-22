package no.isi.insight.planning.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.Repository;
import org.springframework.transaction.annotation.Transactional;

import no.isi.insight.planning.model.RoadRailing;

public interface RoadRailingJpaRepository extends Repository<RoadRailing, UUID> {

  Optional<RoadRailing> findById(
      UUID id
  );

  @Transactional(readOnly = false)
  RoadRailing save(
      RoadRailing railing
  );

  @Transactional(readOnly = false)
  List<RoadRailing> saveAll(
      Iterable<RoadRailing> railings
  );

}
