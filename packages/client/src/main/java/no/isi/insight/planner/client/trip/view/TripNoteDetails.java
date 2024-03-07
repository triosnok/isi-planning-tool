package no.isi.insight.planner.client.trip.view;

import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;
import no.isi.insight.planner.client.geometry.Geometry;

@Builder
@GenerateTypeScript
public record TripNoteDetails(UUID id, String note, Geometry geometry) {

}
