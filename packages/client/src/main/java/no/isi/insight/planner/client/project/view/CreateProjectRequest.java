package no.isi.insight.planner.client.project.view;

import java.time.LocalDateTime;

import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CreateProjectRequest(String name, String referenceCode, LocalDateTime startsAt, LocalDateTime endsAt) {}
