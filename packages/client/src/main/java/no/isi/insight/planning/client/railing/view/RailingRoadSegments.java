package no.isi.insight.planning.client.railing.view;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

/**
 * Aggregate of all segments attached to a railing.
 */
@Builder
@GenerateTypeScript
public record RailingRoadSegments(String reference, RoadCategory category) {}
