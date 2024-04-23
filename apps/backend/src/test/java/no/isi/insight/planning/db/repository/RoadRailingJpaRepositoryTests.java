package no.isi.insight.planning.db.repository;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.Test;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.annotation.IntegrationTest;
import no.isi.insight.planning.geometry.GeometryService;
import no.isi.insight.planning.db.model.RoadRailing;

@IntegrationTest
@RequiredArgsConstructor
class RoadRailingJpaRepositoryTests {
  private final RoadRailingJpaRepository repository;
  private final GeometryService geometryService;

  @Test
  void canSaveAndFindRoadRailing() {
    var wkt = "LINESTRING Z(204510.73 6876165.9 437.779, 204510.57 6876165.41 437.859, 204510.2 6876165.2 437.909)";
    var ls = this.geometryService.parseLineString(wkt)
      .orElseThrow(() -> new IllegalStateException("Unexpected linestring parsing error"));

    var railing = new RoadRailing(
      1L,
      ls,
      1.1
    );

    var saved = this.repository.save(railing);

    assertNotNull(saved.getId());

    var id = saved.getId();

    assertEquals(ls, saved.getGeometry());

    var found = this.repository.findById(id);
    assertTrue(found.isPresent());
    assertEquals(ls, found.get().getGeometry());
  }

}
