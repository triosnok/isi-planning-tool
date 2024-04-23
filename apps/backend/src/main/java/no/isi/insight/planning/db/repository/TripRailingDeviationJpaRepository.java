package no.isi.insight.planning.db.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.Repository;

import no.isi.insight.planning.db.model.TripRailingDeviation;

public interface TripRailingDeviationJpaRepository extends Repository<TripRailingDeviation, UUID> {

  Optional<TripRailingDeviation> findById(
      UUID id
  );

  TripRailingDeviation save(
      TripRailingDeviation deviation
  );

  List<TripRailingDeviation> saveAll(
      Iterable<TripRailingDeviation> deviations
  );

  void delete(
      TripRailingDeviation deviation
  );

}
