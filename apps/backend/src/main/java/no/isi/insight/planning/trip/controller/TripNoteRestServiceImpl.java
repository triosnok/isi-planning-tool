package no.isi.insight.planning.trip.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.capture.service.CaptureReplayService;
import no.isi.insight.planning.client.trip.TripNoteRestService;
import no.isi.insight.planning.client.trip.view.CreateTripNoteRequest;
import no.isi.insight.planning.client.trip.view.TripNoteDetails;
import no.isi.insight.planning.client.trip.view.UpdateTripNoteRequest;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.db.model.Trip;
import no.isi.insight.planning.db.model.TripNote;
import no.isi.insight.planning.db.repository.TripJpaRepository;
import no.isi.insight.planning.db.repository.TripNoteJpaRepository;
import no.isi.insight.planning.utility.GeometryUtils;

@RestController
@RequiredArgsConstructor
public class TripNoteRestServiceImpl implements TripNoteRestService {
  private final TripJpaRepository tripJpaRepository;
  private final TripNoteJpaRepository tripNoteJpaRepository;
  private final CaptureReplayService captureReplayService;

  @Override
  @DriverAuthorization
  public ResponseEntity<TripNoteDetails> addNote(
      CreateTripNoteRequest request
  ) {
    var tripId = request.tripId();
    Trip trip = tripJpaRepository.findById(tripId).orElseThrow(() -> new NotFoundException("Trip not found"));

    var currentPosition = captureReplayService.getCurrentPosition(tripId).orElse(null);

    TripNote tripNote = new TripNote(
      trip,
      request.note(),
      currentPosition
    );

    TripNote savedTripNote = tripNoteJpaRepository.save(tripNote);

    return ResponseEntity.ok(
      new TripNoteDetails(
        savedTripNote.getId(),
        savedTripNote.getNote(),
        GeometryUtils.toClientGeometry(savedTripNote.getPosition()),
        savedTripNote.getAudit().getCreatedAt()
      )
    );
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<TripNoteDetails> updateNote(
      UUID noteId,
      UpdateTripNoteRequest request
  ) {

    TripNote tripNote = tripNoteJpaRepository.findById(noteId)
      .orElseThrow(() -> new NotFoundException("Note not found"));

    tripNote.setNote(request.note());

    TripNote savedTripNote = tripNoteJpaRepository.save(tripNote);

    return ResponseEntity.ok(
      new TripNoteDetails(
        savedTripNote.getId(),
        savedTripNote.getNote(),
        GeometryUtils.toClientGeometry(savedTripNote.getPosition()),
        savedTripNote.getAudit().getCreatedAt()
      )
    );
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<TripNoteDetails>> getNotesByTripId(
      UUID tripId
  ) {

    List<TripNote> tripNotes = tripNoteJpaRepository.getNotesByTripId(tripId);

    return ResponseEntity.ok(
      tripNotes.stream()
        .map(
          tripNote -> new TripNoteDetails(
            tripNote.getId(),
            tripNote.getNote(),
            GeometryUtils.toClientGeometry(tripNote.getPosition()),
            tripNote.getAudit().getCreatedAt()
          )
        )
        .collect(Collectors.toList())
    );
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<TripNoteDetails> deleteNote(
      UUID noteId
  ) {
    TripNote tripNote = tripNoteJpaRepository.findById(noteId)
      .orElseThrow(() -> new NotFoundException("Note not found"));

    tripNoteJpaRepository.deleteById(tripNote.getId());

    return ResponseEntity.ok(
      new TripNoteDetails(
        tripNote.getId(),
        tripNote.getNote(),
        GeometryUtils.toClientGeometry(tripNote.getPosition()),
        tripNote.getAudit().getCreatedAt()
      )
    );
  }
}
