package no.isi.insight.planner.client.project.view;

import java.util.UUID;

import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CreateProjectPlanResponse(UUID projectPlanId) {}
