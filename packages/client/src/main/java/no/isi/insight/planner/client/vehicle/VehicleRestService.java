package no.isi.insight.planner.client.vehicle;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import no.isi.insight.planner.client.vehicle.view.CreateVehicleRequest;
import no.isi.insight.planner.client.vehicle.view.UpdateVehicleRequest;
import no.isi.insight.planner.client.vehicle.view.VehicleDetails;

@HttpExchange("/api/v1/vehicles")
public interface VehicleRestService {

    @PostExchange
    ResponseEntity<VehicleDetails> createVehicle(
            @Validated @RequestBody CreateVehicleRequest request
    );

    @PutExchange("/{id}")
    ResponseEntity<VehicleDetails> updateVehicle(
            @PathVariable UUID id,
            @Validated @RequestBody UpdateVehicleRequest request
    );

    @GetExchange("/{id}")
    ResponseEntity<VehicleDetails> findVehicle(
            @PathVariable UUID id
    );

    @GetExchange
    ResponseEntity<VehicleDetails[]> findAllVehicles();

}
