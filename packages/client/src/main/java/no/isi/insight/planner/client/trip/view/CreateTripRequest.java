package no.isi.insight.planner.client.trip.view;

import java.util.UUID;

import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CreateTripRequest(UUID vehicleId) {

}
