package no.isi.insight.planning.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import no.isi.insight.planning.model.TripRailingCapture;

public interface TripRailingCaptureJpaRepository extends Repository<TripRailingCapture, UUID> {

  Optional<TripRailingCapture> findById(
      UUID id
  );

  // language=sql
  @Query("SELECT trc FROM TripRailingCapture trc WHERE trc.id IN (:ids)")
  List<TripRailingCapture> findAllByIds(
      @Param("ids") Iterable<UUID> ids
  );

  TripRailingCapture save(
      TripRailingCapture capture
  );

}
