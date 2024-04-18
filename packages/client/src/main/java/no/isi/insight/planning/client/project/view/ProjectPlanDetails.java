package no.isi.insight.planning.client.project.view;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.annotation.Optional;

@Builder
@GenerateTypeScript
public record ProjectPlanDetails(
  UUID id,
  UUID projectId,
  String projectName,
  LocalDate startsAt,
  LocalDate endsAt,
  @Optional UUID vehicleId,
  @Optional String vehicleModel,
  @Optional String registrationNumber,
  List<RailingImportDetails> imports,
  int activeTrips,
  int railings,
  double meters
) {}
