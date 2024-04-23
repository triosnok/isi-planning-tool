package no.isi.insight.planning.capture.model;

import java.math.BigDecimal;

import org.locationtech.jts.geom.Point;

import io.hypersistence.utils.hibernate.type.range.Range;
import no.isi.insight.planning.db.model.RoadRailing;
import no.isi.insight.planning.db.model.RoadSegment;
import no.isi.insight.planning.db.model.RoadSide;

public record RailingMatchResult(
  Point point,
  Double heading,
  RoadRailing railing,
  RoadSegment roadSegment,
  RoadSide side,
  Range<BigDecimal> railingTopCoverage,
  Range<BigDecimal> railingSideCoverage,
  double segmentIndex,
  Range<BigDecimal> segmentCoverage
) {}
