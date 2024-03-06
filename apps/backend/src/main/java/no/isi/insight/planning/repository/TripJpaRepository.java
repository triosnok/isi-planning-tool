package no.isi.insight.planning.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.Repository;

import no.isi.insight.planning.model.Trip;

public interface TripJpaRepository extends Repository<Trip, UUID> {

  Trip save(
      Trip trip
  );

  Optional<Trip> findById(
      UUID id
  );
}
