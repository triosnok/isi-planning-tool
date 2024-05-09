package no.isi.insight.planning.client.trip;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.trip.view.CreateTripNoteRequest;
import no.isi.insight.planning.client.trip.view.TripNoteDetails;
import no.isi.insight.planning.client.trip.view.UpdateTripNoteRequest;

@Tag(name = "Trip Notes", description = "Operations on the collection of trip notes")
@HttpExchange("/api/v1/trip-notes")
public interface TripNoteRestService {

  @Operation(summary = "Creates a new trip note")
  @PostExchange
  ResponseEntity<TripNoteDetails> addNote(
      @Validated @RequestBody CreateTripNoteRequest request
  );

  @Operation(summary = "Updates a trip note")
  @PutExchange("/{noteId}")
  ResponseEntity<TripNoteDetails> updateNote(
      @PathVariable UUID noteId,
      @Validated @RequestBody UpdateTripNoteRequest request
  );

  @Operation(summary = "Lists all notes for a trip")
  @GetExchange
  ResponseEntity<List<TripNoteDetails>> getNotesByTripId(
      @RequestParam UUID tripId
  );

  @Operation(summary = "Deletes a trip note from the system")
  @DeleteExchange("/{noteId}")
  ResponseEntity<TripNoteDetails> deleteNote(
      @PathVariable UUID noteId
  );

}
