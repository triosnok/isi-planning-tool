package no.isi.insight.planning.trip.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planner.client.trip.TripRestService;
import no.isi.insight.planner.client.trip.view.TripDetails;
import no.isi.insight.planning.model.Trip;
import no.isi.insight.planning.repository.TripJpaRepository;

@RestController
@RequiredArgsConstructor
public class TripRestServiceImpl implements TripRestService {
  private final TripJpaRepository tripJpaRepository;

  @Override
  public ResponseEntity<TripDetails> createTrip() {

    Trip trip = new Trip();

    Trip savedTrip = tripJpaRepository.save(trip);

    return ResponseEntity.ok(
      new TripDetails(
        savedTrip.getId(),
        null,
        null,
        null,
        null
      )
    );
  }
}
