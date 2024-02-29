package no.isi.insight.planner.client.project.view;

import java.time.LocalDate;

import org.hibernate.validator.constraints.URL;

import jakarta.validation.constraints.NotNull;

public record UpdateProjectPlanRequest(@URL String importUrl, @NotNull LocalDate startsAt, @NotNull LocalDate endsAt) {}
