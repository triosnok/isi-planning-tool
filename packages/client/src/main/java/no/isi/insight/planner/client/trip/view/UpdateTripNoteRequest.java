package no.isi.insight.planner.client.trip.view;

import jakarta.validation.constraints.NotNull;

public record UpdateTripNoteRequest(@NotNull String note) {}
