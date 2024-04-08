package no.isi.insight.planning.capture.model;

import org.locationtech.jts.geom.Point;

import no.isi.insight.planning.model.RoadRailing;
import no.isi.insight.planning.model.RoadSegment;
import no.isi.insight.planning.model.RoadSide;

public record RailingMatchResult(
  Point point,
  Double heading,
  RoadRailing railing,
  RoadSegment roadSegment,
  RoadSide side
) {}
