package no.isi.insight.planner.client.trip;

import java.util.UUID;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import no.isi.insight.planner.client.trip.view.CreateTripNoteRequest;
import no.isi.insight.planner.client.trip.view.CreateTripRequest;
import no.isi.insight.planner.client.trip.view.TripDetails;
import no.isi.insight.planner.client.trip.view.TripNoteDetails;

@HttpExchange("/api/v1/projects/{projectId}/plans/{planId}/trips")
public interface TripRestService {

  @PostExchange
  ResponseEntity<TripDetails> createTrip(
      @PathVariable UUID projectId,
      @PathVariable UUID planId,
      @RequestBody CreateTripRequest request
  );

  @PostExchange("/{tripId}/notes")
  ResponseEntity<TripNoteDetails> addNote(
      @PathVariable UUID tripId,
      @RequestBody CreateTripNoteRequest request
  );

  @GetExchange("/{tripId}")
  ResponseEntity<TripDetails> getTrip(
      @PathVariable UUID tripId
  );

  @GetExchange
  ResponseEntity<List<TripDetails>> getTrips(
      @PathVariable UUID projectId,
      @RequestParam Optional<List<UUID>> planId
  );

}
