package no.isi.insight.planner.client.vehicle.view;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotBlank;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;
import no.isi.insight.planner.client.annotation.Optional;

@GenerateTypeScript
public record CreateVehicleRequest(
  @Optional @URL String imageUrl,
  @NotBlank String registrationNumber,
  @NotBlank String model,
  Boolean camera,
  String description,
  String gnssId
) {}
