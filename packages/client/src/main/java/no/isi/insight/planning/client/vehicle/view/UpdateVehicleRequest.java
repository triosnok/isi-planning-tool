package no.isi.insight.planning.client.vehicle.view;

import java.time.LocalDate;
import no.isi.insight.planning.client.annotation.Optional;

import jakarta.validation.constraints.NotBlank;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record UpdateVehicleRequest(
  @Optional String imageUrl,
  @NotBlank String registrationNumber,
  @NotBlank String model,
  Boolean camera,
  String description,
  String gnssId,
  LocalDate inactiveFrom
) {}
