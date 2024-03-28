package no.isi.insight.planning.client.capture.view;

import java.util.UUID;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CaptureActionRequest(UUID tripId, CaptureAction action) {}
