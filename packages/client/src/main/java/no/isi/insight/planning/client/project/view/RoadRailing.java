package no.isi.insight.planning.client.project.view;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.geometry.Geometry;

@GenerateTypeScript
public record RoadRailing(Geometry geometry, double captureGrade) {}
