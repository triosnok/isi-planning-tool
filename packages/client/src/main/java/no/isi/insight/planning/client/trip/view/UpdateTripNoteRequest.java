package no.isi.insight.planning.client.trip.view;

import jakarta.validation.constraints.NotNull;

public record UpdateTripNoteRequest(@NotNull String note) {}
