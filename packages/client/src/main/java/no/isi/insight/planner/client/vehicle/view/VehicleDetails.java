package no.isi.insight.planner.client.vehicle.view;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@Builder
@GenerateTypeScript
public record VehicleDetails(
  UUID id,
  String imageUrl,
  String registrationNumber,
  String model,
  Boolean camera,
  String description,
  String gnssId,
  LocalDate inactiveFrom
) {

  public boolean isActive() {
    return this.inactiveFrom == null || LocalDate.now().isBefore(this.inactiveFrom);
  }
}
