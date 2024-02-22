package no.isi.insight.planner.client.project.view;

import java.time.LocalDate;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CreateProjectPlanRequest(
  @URL @NotBlank String importUrl,
  @NotNull LocalDate startsAt,
  @NotNull LocalDate endsAt
) {}
