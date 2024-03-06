package no.isi.insight.planner.client.trip;

import org.springframework.http.ResponseEntity;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import no.isi.insight.planner.client.trip.view.TripDetails;

@HttpExchange("/api/v1/trips/{projectPlanId}")
public interface TripRestService {

  @PostExchange
  ResponseEntity<TripDetails> createTrip();

}
