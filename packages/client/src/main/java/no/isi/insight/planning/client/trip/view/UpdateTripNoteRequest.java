package no.isi.insight.planning.client.trip.view;

import jakarta.validation.constraints.NotNull;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record UpdateTripNoteRequest(@NotNull String note) {}
