package no.isi.insight.planning.client.project.view;

import java.time.LocalDate;
import java.util.UUID;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotNull;
import no.isi.insight.planning.client.annotation.Optional;

public record UpdateProjectPlanRequest(
  @Optional @URL String importUrl,
  @NotNull LocalDate startsAt,
  @NotNull LocalDate endsAt,
  @Optional UUID vehicleId
) {}
