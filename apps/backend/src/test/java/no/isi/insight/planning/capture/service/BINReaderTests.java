package no.isi.insight.planning.capture.service;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

import java.io.InputStream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import no.isi.insight.planning.capture.model.Ellipsoid;

class BINReaderTests {

  private InputStream inputStream;

  @BeforeEach
  void setUp() {
    this.inputStream = this.getClass().getClassLoader().getResourceAsStream("HREF2018B_NN2000_EUREF89.bin");
  }

  @Test
  void canReadBINFile() throws Exception {
    assertDoesNotThrow(() -> new BINReader(this.inputStream));
  }

  @Test
  void metadataIsValid() throws Exception {
    var reader = new BINReader(this.inputStream);
    var metadata = reader.getMetadata();
    assertEquals(Ellipsoid.LAT_LON, metadata.getEllipsoid());
    assertEquals(4.0, metadata.minLon(), 0.0);
    assertEquals(32.0, metadata.maxLon(), 0.0);
    assertEquals(57.8, metadata.minLat(), 0.0);
    assertEquals(72.0, metadata.maxLat(), 0.0);
    assertEquals(0.04, metadata.sizeLon(), 0.0);
    assertEquals(0.02, metadata.sizeLat(), 0.0);
    assertEquals(0, metadata.utm());
    assertEquals(0, metadata.zone());
  }

  @Test
  void canGetOffset() throws Exception {
    var reader = new BINReader(this.inputStream);
    var offset = reader.getOffset(63.5, 7.5);
    assertEquals(43.7, offset, 0.1);
    offset = reader.getOffset(70.0, 30.0);
    assertEquals(19.6, offset, 0.1);
    offset = reader.getOffset(62.55886102464636, 7.6822575669288105);
    assertEquals(44.5, offset, 0.1);
  }

}
