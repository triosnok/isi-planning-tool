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
      t.startedAt,
      t.endedAt,
      t.gnssLog,
      t.cameraLogs
    )  FROM Trip t
    INNER JOIN t.projectPlan pp
    INNER JOIN pp.project p
    WHERE 1=1
      AND p.id = :projectId
      AND COALESCE(:planIds, NULL) IS NULL OR pp.id IN (:planIds)
    """)
  List<TripDetails> findAllByProjectId(
      @Param("projectId") UUID projectId,
      @Param("planIds") List<UUID> planIds
  );

}
