package no.isi.insight.planning.client.project.view;

import java.util.UUID;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CreateProjectResponse(UUID projectId) {}
