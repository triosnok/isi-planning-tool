package no.isi.insight.planning.client.trip.view;

import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.geometry.Geometry;

@Builder
@GenerateTypeScript
public record TripNoteDetails(UUID id, String note, Geometry geometry) {

}
