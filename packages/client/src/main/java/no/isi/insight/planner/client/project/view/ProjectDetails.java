package no.isi.insight.planner.client.project.view;

import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@Builder
@GenerateTypeScript
public record ProjectDetails(UUID id, String name, String referenceCode) {}
