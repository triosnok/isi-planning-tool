package no.isi.insight.planning.db.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import no.isi.insight.planning.db.model.Trip;

public interface TripJpaRepository extends Repository<Trip, UUID> {

  Trip save(
      Trip trip
  );

  @Transactional(readOnly = true)
  Optional<Trip> findById(
      UUID id
  );

  // language=sql
  @Query("""
      SELECT
        COALESCE(MAX(t.sequenceNumber) + 1, 1)
      FROM Trip t
      INNER JOIN t.projectPlan pp
      INNER JOIN pp.project p
      WHERE p.id = :projectId
    """)
  int findNextSequenceNumber(
      @Param("projectId") UUID projectId
  );

  // language=sql
  @Query("""
    SELECT COUNT(tn)
    FROM TripNote tn
    WHERE tn.trip.id = :tripId
    """)
  Long countTripNotesByTripId(
      @Param("tripId") UUID tripId
  );

}
