package no.isi.insight.planner.client.vehicle.view;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotBlank;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CreateVehicleRequest(
  @URL String imageUrl,
  @NotBlank String registrationNumber,
  Boolean camera,
  String description,
  String gnssId
) {}
