package no.isi.insight.planning.client.trip;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.trip.view.CreateTripRequest;
import no.isi.insight.planning.client.trip.view.TripDetails;
import no.isi.insight.planning.client.trip.view.UpdateTripRequest;

@Tag(name = "Trips", description = "Operations on the collection of trips")
@HttpExchange("/api/v1/trips")
public interface TripRestService {

  @Operation(summary = "Creates a new trip")
  @PostExchange
  ResponseEntity<TripDetails> createTrip(
      @Validated @RequestBody CreateTripRequest request
  );

  @Operation(summary = "Finds a trip by its id")
  @GetExchange("/{tripId}")
  ResponseEntity<TripDetails> getTrip(
      @PathVariable UUID tripId
  );

  @Operation(summary = "Lists trips with optional filtering")
  @GetExchange
  ResponseEntity<List<TripDetails>> getTrips(
      @RequestParam Optional<UUID> projectId,
      @RequestParam Optional<List<UUID>> planId,
      @RequestParam Optional<Boolean> active
  );

  @Operation(summary = "Updates a trip")
  @PutExchange("/{tripId}")
  ResponseEntity<TripDetails> updateTrip(
      @PathVariable UUID tripId,
      @RequestBody UpdateTripRequest request
  );
}
