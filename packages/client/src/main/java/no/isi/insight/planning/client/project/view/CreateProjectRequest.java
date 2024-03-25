package no.isi.insight.planning.client.project.view;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.annotation.Optional;

@GenerateTypeScript
public record CreateProjectRequest(
  @NotBlank String name,
  @NotBlank String referenceCode,
  @NotNull LocalDate startsAt,
  @Optional LocalDate endsAt
) {}
