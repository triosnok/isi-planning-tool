package no.isi.insight.planning.client.trip;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.trip.view.CreateTripRequest;
import no.isi.insight.planning.client.trip.view.TripDetails;
import no.isi.insight.planning.client.trip.view.UpdateTripRequest;

@Tag(name = "Trips")
@HttpExchange("/api/v1/trips")
public interface TripRestService {

  @PostExchange
  ResponseEntity<TripDetails> createTrip(
      @RequestBody CreateTripRequest request
  );

  @GetExchange("/{tripId}")
  ResponseEntity<TripDetails> getTrip(
      @PathVariable UUID tripId
  );

  @GetExchange
  ResponseEntity<List<TripDetails>> getTrips(
      @RequestParam UUID projectId,
      @RequestParam Optional<List<UUID>> planId
  );

  @PutExchange("/{tripId}")
  ResponseEntity<TripDetails> updateTrip(
      @PathVariable UUID tripId,
      @RequestBody UpdateTripRequest request
  );

  @GetExchange("/vehicle/{vehicleId}")
  ResponseEntity<List<TripDetails>> getTripsByVehicleId(
      @PathVariable UUID vehicleId
  );

}
