package no.isi.insight.planner.client.project.view;

import java.time.LocalDate;

import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CreateProjectRequest(String name, String referenceCode, LocalDate startsAt, LocalDate endsAt) {}
