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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.project.view.ProjectPlanDetails;
import no.isi.insight.planning.client.trip.view.TripDetails;
import no.isi.insight.planning.client.vehicle.view.CreateVehicleRequest;
import no.isi.insight.planning.client.vehicle.view.UpdateVehicleRequest;
import no.isi.insight.planning.client.vehicle.view.VehicleDetails;

@Tag(name = "Vehicles", description = "Operations on the collection of vehicles")
@HttpExchange("/api/v1/vehicles")
public interface VehicleRestService {

  @Operation(summary = "Creates a new vehicle")
  @PostExchange
  ResponseEntity<VehicleDetails> createVehicle(
      @Validated @RequestBody CreateVehicleRequest request
  );

  @Operation(summary = "Updates a vehicle")
  @PutExchange("/{id}")
  ResponseEntity<VehicleDetails> updateVehicle(
      @PathVariable UUID id,
      @Validated @RequestBody UpdateVehicleRequest request
  );

  @Operation(summary = "Finds a vehicle by its id")
  @GetExchange("/{id}")
  ResponseEntity<VehicleDetails> findVehicle(
      @PathVariable UUID id
  );

  @Operation(summary = "Lists all vehicles with availability based on its assignments")
  @GetExchange
  ResponseEntity<List<VehicleDetails>> findAllVehicles(
      @RequestParam @DateTimeFormat(iso = ISO.DATE_TIME) Optional<LocalDate> availableFrom,
      @RequestParam @DateTimeFormat(iso = ISO.DATE_TIME) Optional<LocalDate> availableTo
  );

  @Operation(summary = "Lists all plans where a vehicle is assigned")
  @GetExchange("/{id}/plans")
  ResponseEntity<List<ProjectPlanDetails>> findPlansByVehicleId(
      @PathVariable UUID id
  );

  @Operation(summary = "Lists all trips a vehicle has been used for")
  @GetExchange("/{id}/trips")
  ResponseEntity<List<TripDetails>> findTripsByVehicleId(
      @PathVariable UUID id
  );

}
