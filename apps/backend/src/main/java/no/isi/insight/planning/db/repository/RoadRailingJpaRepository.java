package no.isi.insight.planning.db.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import no.isi.insight.planning.db.model.RoadRailing;

public interface RoadRailingJpaRepository extends Repository<RoadRailing, Long> {

  Optional<RoadRailing> findById(
      Long id
  );

  // language=sql
  @Query("""
      SELECT
        r
      FROM Trip t
      INNER JOIN t.projectPlan pp
      INNER JOIN pp.railings r
      JOIN FETCH r.roadSegments
      WHERE t.id = :tripId
    """)
  List<RoadRailing> findAllByTripIdEager(
      @Param("tripId") UUID tripId
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
