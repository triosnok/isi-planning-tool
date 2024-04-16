package no.isi.insight.planning.client.project.view;

import java.time.LocalDate;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.geometry.Geometry;

@GenerateTypeScript
public record RoadRailing(Long id, Geometry geometry, double length, double captureGrade, LocalDate capturedAt) {}
