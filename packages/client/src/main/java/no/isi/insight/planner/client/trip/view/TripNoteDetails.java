package no.isi.insight.planner.client.trip.view;

import java.util.UUID;

import no.isi.insight.planner.client.geometry.Geometry;

public record TripNoteDetails(UUID id, String note, Geometry geometry) {

}
