package no.isi.insight.planner.client.geometry;

import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record Geometry(String wkt, int srid) {}
