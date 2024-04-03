package no.isi.insight.planning.repository;

import java.util.UUID;
import java.util.List;

import org.springframework.data.repository.Repository;

import no.isi.insight.planning.model.TripRailingDeviation;

public interface TripRailingDeviationJpaRepository extends Repository<UUID, TripRailingDeviation> {

  TripRailingDeviation save(
      TripRailingDeviation deviation
  );

  List<TripRailingDeviation> saveAll(
      Iterable<TripRailingDeviation> deviations
  );

}
