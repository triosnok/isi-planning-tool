package no.isi.insight.planning.client.vehicle.view;

import jakarta.validation.constraints.NotBlank;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.annotation.Optional;

@GenerateTypeScript
public record CreateVehicleRequest(
  @Optional String imageUrl,
  @NotBlank String registrationNumber,
  @NotBlank String model,
  Boolean camera,
  String description,
  String gnssId
) {}
