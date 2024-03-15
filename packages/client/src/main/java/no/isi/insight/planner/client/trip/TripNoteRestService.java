package no.isi.insight.planner.client.trip;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import no.isi.insight.planner.client.trip.view.CreateTripNoteRequest;
import no.isi.insight.planner.client.trip.view.TripNoteDetails;
import no.isi.insight.planner.client.trip.view.UpdateTripNoteRequest;

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

}