package no.isi.insight.planner.client.trip.view;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CreateTripRequest(@NotNull UUID planId, @NotNull UUID vehicleId) {

}
