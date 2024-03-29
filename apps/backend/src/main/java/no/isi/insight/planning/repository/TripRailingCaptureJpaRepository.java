package no.isi.insight.planning.repository;

import java.util.UUID;

import org.springframework.data.repository.Repository;

import no.isi.insight.planning.model.TripRailingCapture;

public interface TripRailingCaptureJpaRepository extends Repository<TripRailingCapture, UUID> {

  TripRailingCapture save(
      TripRailingCapture capture
  );

}
