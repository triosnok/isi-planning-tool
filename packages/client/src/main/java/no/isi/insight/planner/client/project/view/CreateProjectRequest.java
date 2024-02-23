package no.isi.insight.planner.client.project.view;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CreateProjectRequest(
  @NotBlank String name,
  @NotBlank String referenceCode,
  @NotNull LocalDate startsAt,
  @NotNull LocalDate endsAt
) {}
