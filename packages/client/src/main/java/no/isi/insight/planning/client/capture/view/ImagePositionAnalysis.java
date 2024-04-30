package no.isi.insight.planning.client.capture.view;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record ImagePositionAnalysis(long count, long target, ImageStatus status) {}
