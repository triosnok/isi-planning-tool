package no.isi.insight.planning.repository;

import java.util.UUID;
import java.util.Optional;

import org.springframework.data.repository.Repository;

import no.isi.insight.planning.model.RoadRailing;

public interface RoadRailingJpaRepository extends Repository<RoadRailing, UUID> {

  Optional<RoadRailing> findById(UUID id);

  RoadRailing save(RoadRailing railing);

}
