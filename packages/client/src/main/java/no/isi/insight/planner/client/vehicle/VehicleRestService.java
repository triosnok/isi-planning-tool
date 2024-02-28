package no.isi.insight.planner.client.vehicle;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import no.isi.insight.planner.client.vehicle.view.CreateVehicleRequest;
import no.isi.insight.planner.client.vehicle.view.VehicleDetails;

@HttpExchange("/api/v1/vehicles")
public interface VehicleRestService {

  @PostExchange
  ResponseEntity<VehicleDetails> createVehicle(
      @RequestBody CreateVehicleRequest request
  );

}
