package no.isi.insight.planner.client.vehicle.view;

import java.time.LocalDate;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotBlank;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record UpdateVehicleRequest(
  @URL String imageUrl,
  @NotBlank String registrationNumber,
  @NotBlank String model,
  Boolean camera,
  String description,
  String gnssId,
  LocalDate inactiveFrom
) {}
