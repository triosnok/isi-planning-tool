package no.isi.insight.planner.client.trip.view;

import jakarta.validation.constraints.NotBlank;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CreateTripNoteRequest(@NotBlank String note) {}
