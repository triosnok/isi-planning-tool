package no.isi.insight.planning.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import no.isi.insight.planner.client.trip.view.TripDetails;
import no.isi.insight.planning.model.Trip;

public interface TripJpaRepository extends Repository<Trip, UUID> {

  Trip save(
      Trip trip
  );

  Optional<Trip> findById(
      UUID id
  );

  // language=sql
  @Query("""
    SELECT new no.isi.insight.planner.client.trip.view.TripDetails(
      t.id,
      d.fullName,
      t.startedAt,
      t.endedAt,
      t.gnssLog,
      t.cameraLogs,
      t.sequenceNumber,
      0
    )  FROM Trip t
    INNER JOIN t.projectPlan pp
    INNER JOIN pp.project p
    INNER JOIN t.driver d
    WHERE 1=1
      AND p.id = :projectId
      AND COALESCE(:planIds, NULL) IS NULL OR pp.id IN (:planIds)
    """)
  List<TripDetails> findAllByProjectId(
      @Param("projectId") UUID projectId,
      @Param("planIds") List<UUID> planIds
  );

  // language=sql
  @Query("""
      SELECT
        COALESCE(MAX(t.sequenceNumber) + 1, 1)
      FROM Trip t
      INNER JOIN t.projectPlan
      WHERE t.projectPlan.id = :planId
    """)
  int findNextSequenceNumber(
      @Param("planId") UUID planId
  );

}
