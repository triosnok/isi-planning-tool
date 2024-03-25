package no.isi.insight.planning.client.vehicle.view;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotBlank;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.annotation.Optional;

@GenerateTypeScript
public record CreateVehicleRequest(
  @Optional @URL String imageUrl,
  @NotBlank String registrationNumber,
  @NotBlank String model,
  Boolean camera,
  String description,
  String gnssId
) {}
