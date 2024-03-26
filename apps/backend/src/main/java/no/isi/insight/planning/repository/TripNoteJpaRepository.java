package no.isi.insight.planning.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.Repository;

import no.isi.insight.planning.model.TripNote;

public interface TripNoteJpaRepository extends Repository<TripNote, UUID> {

  TripNote save(
      TripNote tripNote
  );

  Optional<TripNote> findById(
      UUID id
  );

  List<TripNote> getNotesByTripId(
      UUID tripId
  );

  void deleteById(
      UUID id
  );
}
