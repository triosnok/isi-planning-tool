package no.isi.insight.planning.capture.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

import no.isi.insight.planning.geometry.GeometryProperties;
import no.isi.insight.planning.geometry.GeometryService;
import no.isi.insight.planning.db.model.RoadDirection;
import no.isi.insight.planning.db.model.RoadRailing;
import no.isi.insight.planning.db.model.RoadSegment;
import no.isi.insight.planning.db.model.RoadSide;

class CaptureRailingMatcherTests {

  private static final GeometryService GEOMETRY_SERVICE = new GeometryService(new GeometryProperties(null));

  // plotting the points in desmos or similar tools help:
  // rail: (1,3), (2,2), (3,1)
  // segment: (2,4), (3,3), (4,2)
  private List<RoadRailing> createValidRailing(
      RoadDirection direction
  ) {
    var railings = new ArrayList<RoadRailing>();

    var railing = new RoadRailing(
      1L,
      GEOMETRY_SERVICE.parseLineString("LINESTRING Z(1 3 1, 2 2 1, 3 1 1)").get(),
      null
    );

    railing.getRoadSegments()
      .add(
        new RoadSegment(
          "seg",
          railing,
          GEOMETRY_SERVICE.parseLineString("LINESTRING Z(2 4 1, 3 3 1, 4 2 1)").get(),
          3.0,
          direction,
          RoadSide.RIGHT
        )
      );

    railings.add(railing);

    railing = new RoadRailing(
      2L,
      GEOMETRY_SERVICE.parseLineString("LINESTRING Z(3 1 1, 4 0 1, 5 -1 1)").get(),
      null
    );

    railing.getRoadSegments()
      .add(
        new RoadSegment(
          "seg@2",
          railing,
          GEOMETRY_SERVICE.parseLineString("LINESTRING Z(4 2 1, 5 1 1, 6 0 1)").get(),
          3.0,
          direction,
          RoadSide.RIGHT
        )
      );

    railings.add(railing);

    return railings;
  }

  @Test
  void matchesRailings() {
    var matcher = new CaptureRailingMatcher(
      this.createValidRailing(RoadDirection.WITH),
      GEOMETRY_SERVICE,
      4.0
    );

    var heading = -45.0;

    var match = matcher.matchRailings(GEOMETRY_SERVICE.parsePoint("POINT Z(2 3 1)").get(), heading);
    assertFalse(match.isEmpty());
    assertEquals(heading, match.get(0).heading(), 0.0);

    match = matcher.matchRailings(GEOMETRY_SERVICE.parsePoint("POINT Z(2.5 2.5 1)").get(), heading);
    assertFalse(match.isEmpty());
    assertEquals(heading, match.get(0).heading(), 0.0);

    match = matcher.matchRailings(GEOMETRY_SERVICE.parsePoint("POINT Z(3 2 1)").get(), heading);
    assertFalse(match.isEmpty());
    assertEquals(heading, match.get(0).heading(), 0.0);
  }

  @Test
  void matchesMultiple() {
    var matcher = new CaptureRailingMatcher(
      this.createValidRailing(RoadDirection.WITH),
      GEOMETRY_SERVICE,
      4.0
    );

    var matches = matcher.matchRailings(GEOMETRY_SERVICE.parsePoint("POINT Z(4.5 1.5 1)").get(), -45.0);
    assertEquals(2, matches.size());
  }

  @Test
  void doesNotMatchWrongHeight() {
    var matcher = new CaptureRailingMatcher(
      this.createValidRailing(RoadDirection.WITH),
      GEOMETRY_SERVICE,
      4.0
    );

    var heading = -45.0;

    var match = matcher.matchRailings(GEOMETRY_SERVICE.parsePoint("POINT Z(2 3 5)").get(), heading);
    assertTrue(match.isEmpty());
  }

}
