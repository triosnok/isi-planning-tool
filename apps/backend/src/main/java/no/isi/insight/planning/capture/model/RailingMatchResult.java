package no.isi.insight.planning.capture.model;

import org.locationtech.jts.geom.Point;

import no.isi.insight.planning.model.RoadRailing;
import no.isi.insight.planning.model.RoadSegment;

public record RailingMatchResult(Point point, Double heading, RoadRailing railing, RoadSegment roadSegment) {}
