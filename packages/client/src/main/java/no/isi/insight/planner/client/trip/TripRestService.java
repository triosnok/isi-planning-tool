package no.isi.insight.planner.client.trip;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import no.isi.insight.planner.client.trip.view.CreateTripRequest;
import no.isi.insight.planner.client.trip.view.TripDetails;

@HttpExchange("/api/v1/projects/{projectId}/plans/{planId}/trips")
public interface TripRestService {

  @PostExchange
  ResponseEntity<TripDetails> createTrip(
      @PathVariable UUID projectId,
      @PathVariable UUID planId,
      @RequestBody CreateTripRequest request
  );

}
