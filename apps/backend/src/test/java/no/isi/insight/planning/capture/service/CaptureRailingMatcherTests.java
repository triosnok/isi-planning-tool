package no.isi.insight.planning.capture.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

import no.isi.insight.planning.geometry.GeometryProperties;
import no.isi.insight.planning.geometry.GeometryService;
import no.isi.insight.planning.model.RoadDirection;
import no.isi.insight.planning.model.RoadRailing;
import no.isi.insight.planning.model.RoadSegment;
import no.isi.insight.planning.model.RoadSide;

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

    var match = matcher.matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(2 3 1)").get(), heading);
    assertTrue(match.isPresent());
    assertEquals(heading, match.get().heading(), 0.0);

    match = matcher.matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(2.5 2.5 1)").get(), heading);
    assertTrue(match.isPresent());
    assertEquals(heading, match.get().heading(), 0.0);

    match = matcher.matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(3 2 1)").get(), heading);
    assertTrue(match.isPresent());
    assertEquals(heading, match.get().heading(), 0.0);
  }

  // @Test
  // void doesNotMatchWrongDirectionWith() {
  //   var withMatcher = new CaptureRailingMatcher(
  //     this.createValidRailing(RoadDirection.WITH),
  //     GEOMETRY_SERVICE,
  //     4.0
  //   );

  //   var oppositeHeadingWith = -225.0;

  //   var match = withMatcher.matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(2 3 1)").get(), oppositeHeadingWith);
  //   assertFalse(match.isPresent());

  //   match = withMatcher.matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(2.5 2.5 1)").get(), oppositeHeadingWith);
  //   assertFalse(match.isPresent());

  //   match = withMatcher.matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(3 2 1)").get(), oppositeHeadingWith);
  //   assertFalse(match.isPresent());
  // }

  // @Test
  // void doesNotMatchWrongDirectionAgainst() {
  //   var againstMatcher = new CaptureRailingMatcher(
  //     this.createValidRailing(RoadDirection.AGAINST),
  //     GEOMETRY_SERVICE,
  //     4.0
  //   );

  //   var oppositeHeadingAgainst = -45.0;

  //   var match = againstMatcher
  //     .matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(2 3 1)").get(), oppositeHeadingAgainst);
  //   assertFalse(match.isPresent());

  //   match = againstMatcher
  //     .matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(2.5 2.5 1)").get(), oppositeHeadingAgainst);
  //   assertFalse(match.isPresent());

  //   match = againstMatcher.matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(3 2 1)").get(), oppositeHeadingAgainst);
  //   assertFalse(match.isPresent());
  // }

  // @Test
  // void canMatchAgainstDirection() {
  //   var matcher = new CaptureRailingMatcher(
  //     this.createValidRailing(RoadDirection.WITH),
  //     GEOMETRY_SERVICE,
  //     4.0
  //   );

  //   var heading = -225.0;

  //   var match = matcher.matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(2 3 1)").get(), heading);
  //   assertFalse(match.isPresent());

  //   match = matcher.matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(2.5 2.5 1)").get(), heading);
  //   assertFalse(match.isPresent());

  //   match = matcher.matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(3 2 1)").get(), heading);
  //   assertFalse(match.isPresent());
  // }

  @Test
  void doesNotMatchWrongHeight() {
    var matcher = new CaptureRailingMatcher(
      this.createValidRailing(RoadDirection.WITH),
      GEOMETRY_SERVICE,
      4.0
    );

    var heading = -45.0;

    var match = matcher.matchRailing(GEOMETRY_SERVICE.parsePoint("POINT Z(2 3 5)").get(), heading);
    assertFalse(match.isPresent());
  }

}
