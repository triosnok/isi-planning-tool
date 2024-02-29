package no.isi.insight.planner.client.project.view;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@Builder
@GenerateTypeScript
public record ProjectPlanDetails(
  UUID id,
  LocalDate startsAt,
  LocalDate endsAt,
  String vehicleModel,
  String registrationNumber,
  int activeTrips,
  int railings,
  double meters
) {}
