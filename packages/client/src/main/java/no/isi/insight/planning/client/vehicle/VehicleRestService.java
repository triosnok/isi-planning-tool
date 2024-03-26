package no.isi.insight.planning.client.vehicle;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.vehicle.view.CreateVehicleRequest;
import no.isi.insight.planning.client.vehicle.view.UpdateVehicleRequest;
import no.isi.insight.planning.client.vehicle.view.VehicleDetails;

@Tag(name = "Vehicles")
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
  ResponseEntity<List<VehicleDetails>> findAllVehicles(
      @RequestParam @DateTimeFormat(iso = ISO.DATE_TIME) Optional<LocalDate> availableFrom,
      @RequestParam @DateTimeFormat(iso = ISO.DATE_TIME) Optional<LocalDate> availableTo
  );

}
