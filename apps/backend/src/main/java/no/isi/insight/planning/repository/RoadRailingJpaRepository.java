package no.isi.insight.planning.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import no.isi.insight.planning.model.RoadRailing;

public interface RoadRailingJpaRepository extends Repository<RoadRailing, Long> {

  Optional<RoadRailing> findById(
      Long id
  );

  @Query("SELECT r FROM RoadRailing r WHERE r.id IN (:ids)")
  List<RoadRailing> findAllByIds(
      @Param("ids") Iterable<Long> ids
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
