package no.isi.insight.planner.client.project.view;

import no.isi.insight.planner.client.annotation.GenerateTypeScript;
import no.isi.insight.planner.client.geometry.Geometry;

@GenerateTypeScript
public record RoadRailing(Geometry geometry, double captureGrade) {}
