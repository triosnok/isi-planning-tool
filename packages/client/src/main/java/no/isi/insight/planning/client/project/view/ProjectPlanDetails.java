package no.isi.insight.planning.client.project.view;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@Builder
@GenerateTypeScript
public record ProjectPlanDetails(
  UUID id,
  UUID projectId,
  String projectName,
  LocalDate startsAt,
  LocalDate endsAt,
  String vehicleModel,
  String registrationNumber,
  int activeTrips,
  int railings,
  double meters
) {}
