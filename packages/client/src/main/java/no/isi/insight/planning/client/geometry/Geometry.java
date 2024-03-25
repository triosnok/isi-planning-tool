package no.isi.insight.planning.client.geometry;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record Geometry(String wkt, int srid) {}
