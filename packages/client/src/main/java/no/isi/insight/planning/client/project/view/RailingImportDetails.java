package no.isi.insight.planning.client.project.view;

import java.time.LocalDateTime;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record RailingImportDetails(Long count, String url, LocalDateTime importedAt) {}
