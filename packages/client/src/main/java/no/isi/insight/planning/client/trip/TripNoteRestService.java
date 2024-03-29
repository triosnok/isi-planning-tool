package no.isi.insight.planning.client.trip;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.trip.view.CreateTripNoteRequest;
import no.isi.insight.planning.client.trip.view.TripNoteDetails;
import no.isi.insight.planning.client.trip.view.UpdateTripNoteRequest;

@Tag(name = "Trip Notes")
@HttpExchange("/api/v1/trip-notes")
public interface TripNoteRestService {

  @PostExchange
  ResponseEntity<TripNoteDetails> addNote(
      @RequestBody CreateTripNoteRequest request
  );

  @PutExchange("/{noteId}")
  ResponseEntity<TripNoteDetails> updateNote(
      @PathVariable UUID noteId,
      @RequestBody UpdateTripNoteRequest request
  );

  @GetExchange
  ResponseEntity<List<TripNoteDetails>> getNotesByTripId(
      @RequestParam UUID tripId
  );

  @DeleteExchange
  ResponseEntity<TripNoteDetails> deleteNote(
      @RequestParam UUID noteId
  );

}
