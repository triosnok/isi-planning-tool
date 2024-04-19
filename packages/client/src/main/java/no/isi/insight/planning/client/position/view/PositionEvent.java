package no.isi.insight.planning.client.position.view;

import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.geometry.Geometry;

@Builder
@GenerateTypeScript
public record PositionEvent(UUID driverId, UUID vehicleId, UUID tripId, Geometry geometry, double heading) {}
