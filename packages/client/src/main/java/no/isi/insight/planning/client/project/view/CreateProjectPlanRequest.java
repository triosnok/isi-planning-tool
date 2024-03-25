package no.isi.insight.planning.client.project.view;

import java.time.LocalDate;
import java.util.UUID;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.annotation.Optional;

@GenerateTypeScript
public record CreateProjectPlanRequest(
  @NotNull UUID projectId,
  @URL @NotBlank String importUrl,
  @NotNull LocalDate startsAt,
  @NotNull LocalDate endsAt,
  @Optional UUID vehicleId
) {}
