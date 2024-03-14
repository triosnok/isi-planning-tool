package no.isi.insight.planning.trip.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.trip.TripNoteRestService;
import no.isi.insight.planner.client.trip.view.CreateTripNoteRequest;
import no.isi.insight.planner.client.trip.view.TripNoteDetails;
import no.isi.insight.planner.client.trip.view.UpdateTripNoteRequest;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.model.Trip;
import no.isi.insight.planning.model.TripNote;
import no.isi.insight.planning.repository.TripJpaRepository;
import no.isi.insight.planning.repository.TripNoteJpaRepository;
import no.isi.insight.planning.utility.GeometryUtils;

@RestController
@RequiredArgsConstructor
public class TripNoteRestServiceImpl implements TripNoteRestService {
  private final TripJpaRepository tripJpaRepository;
  private final TripNoteJpaRepository tripNoteJpaRepository;

  @Override
  @DriverAuthorization
  public ResponseEntity<TripNoteDetails> addNote(
      CreateTripNoteRequest request
  ) {
    var tripId = request.tripId();
    Trip trip = tripJpaRepository.findById(tripId).orElseThrow(() -> new NotFoundException("Trip not found"));

    TripNote tripNote = new TripNote(
      trip,
      request.note(),
      null
    );

    TripNote savedTripNote = tripNoteJpaRepository.save(tripNote);

    return ResponseEntity.ok(
      new TripNoteDetails(
        savedTripNote.getId(),
        savedTripNote.getNote(),
        GeometryUtils.toClientGeometry(savedTripNote.getPosition())
      )
    );
  }

  @Override
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
        GeometryUtils.toClientGeometry(savedTripNote.getPosition())
      )
    );
  }
}
