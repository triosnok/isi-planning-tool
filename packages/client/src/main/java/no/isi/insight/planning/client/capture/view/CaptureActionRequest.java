package no.isi.insight.planning.client.capture.view;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CaptureActionRequest(@NotNull UUID tripId, CaptureAction action) {}
