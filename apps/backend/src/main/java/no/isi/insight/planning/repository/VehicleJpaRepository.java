package no.isi.insight.planning.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.Repository;

import no.isi.insight.planning.model.Vehicle;

public interface VehicleJpaRepository extends Repository<Vehicle, UUID> {

  Vehicle save(
      Vehicle vehicle
  );

  Optional<Vehicle> findById(
      UUID id
  );

}
