package no.isi.insight.planning.capture.model;

import org.locationtech.jts.geom.Point;

import io.hypersistence.utils.hibernate.type.range.Range;
import no.isi.insight.planning.model.RoadRailing;
import no.isi.insight.planning.model.RoadSegment;
import no.isi.insight.planning.model.RoadSide;

public record RailingMatchResult(
  Point point,
  Double heading,
  RoadRailing railing,
  RoadSegment roadSegment,
  RoadSide side,
  Range<Double> railingTopCoverage,
  Range<Double> railingSideCoverage,
  double segmentIndex,
  Range<Double> segmentCoverage
) {}
