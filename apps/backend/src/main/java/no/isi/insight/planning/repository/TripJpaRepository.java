package no.isi.insight.planning.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import no.isi.insight.planning.client.trip.view.TripDetails;
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
    SELECT new no.isi.insight.planning.client.trip.view.TripDetails(
      t.id,
      pp.id,
      p.id,
      p.name,
      d.fullName,
      t.startedAt,
      t.endedAt,
      t.gnssLog,
      t.cameraLogs,
      t.sequenceNumber,
      COALESCE(
        (SELECT COUNT(tn) FROM TripNote tn WHERE tn.trip.id = t.id),
        0
      ),
      0
    )  FROM Trip t
    INNER JOIN t.projectPlan pp
    INNER JOIN pp.project p
    INNER JOIN t.driver d
    INNER JOIN t.vehicle v
    WHERE 1=1
      AND (:projectId IS NULL OR p.id = :projectId)
      AND (:driverId IS NULL OR d.userAccountId = :driverId)
      AND (:vehicleId IS NULL OR v.id = :vehicleId)
      AND (COALESCE(:planIds, NULL) IS NULL OR pp.id IN (:planIds))
      AND (:active IS NULL OR ((:active = false AND t.endedAt IS NOT NULL) OR (:active = true AND t.endedAt IS NULL)))
    """)
  List<TripDetails> findAll(
      @Param("projectId") Optional<UUID> projectId,
      @Param("driverId") Optional<UUID> driverId,
      @Param("vehicleId") Optional<UUID> vehicleId,
      @Param("planIds") List<UUID> planIds,
      @Param("active") Optional<Boolean> active
  );

  default List<TripDetails> findAllByProjectId(
      UUID projectId,
      List<UUID> planIds
  ) {
    return this.findAll(Optional.of(projectId), Optional.empty(), Optional.empty(), planIds, Optional.empty());
  }

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

  default List<TripDetails> findAllByVehicleId(
      UUID vehicleId
  ) {
    return this.findAll(Optional.empty(), Optional.empty(), Optional.of(vehicleId), null, Optional.empty());
  }

  default List<TripDetails> findAllByDriverId(
      UUID driverId,
      Optional<Boolean> active
  ) {
    return this.findAll(Optional.empty(), Optional.of(driverId), Optional.empty(), null, active);
  }

  default List<TripDetails> findAllActiveTrips() {
    return this.findAll(Optional.empty(), Optional.empty(), Optional.empty(), null, Optional.of(true));
  }

}
