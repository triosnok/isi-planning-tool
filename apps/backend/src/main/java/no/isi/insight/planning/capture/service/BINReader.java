package no.isi.insight.planning.capture.service;

import java.io.InputStream;
import java.io.DataInputStream;

import org.locationtech.jts.geom.Coordinate;

/**
 * Reader for BIN files following the Gravsoft BIN format. The BIN format is divided into blocks of
 * 64 bytes, with the first block being a metadata block consisting of information present in
 * {@link BINMetadata}.
 * 
 * The data blocks form a grid where rows are the along the lines of latitude, and columns are along
 * the lines of longitude. The 64 byte data blocks are divided into 16 floating point numbers.
 */
public class BINReader {
  private final BINMetadata metadata;
  private final float[][] grid;

  public BINReader(
      InputStream in
  ) throws Exception {
    var inStream = new DataInputStream(in);
    var icode = inStream.readInt();

    if (icode != 777) {
      throw new IllegalStateException("Invalid BIN file: icode is not 777");
    }

    this.metadata = new BINMetadata(
      inStream.readDouble(),
      inStream.readDouble(),
      inStream.readDouble(),
      inStream.readDouble(),
      inStream.readDouble(),
      inStream.readDouble(),
      inStream.readInt(),
      inStream.readInt(),
      inStream.readInt()
    );

    var cols = (int) Math.ceil((this.metadata.maxLon() - this.metadata.minLon()) / this.metadata.sizeLon());
    var rows = (int) Math.ceil((this.metadata.maxLat() - this.metadata.minLat()) / this.metadata.sizeLat());

    this.grid = new float[cols][rows];

    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        this.grid[i][j] = inStream.readFloat();
      }
    }
  }

  public BINMetadata getMetadata() {
    return this.metadata;
  }

  public float getOffset(
      double longitude,
      double latitude
  ) {
    return this.grid[(int) Math.floor((longitude - this.metadata.minLon()) / this.metadata.sizeLon())][(int) Math
      .floor((latitude - this.metadata.minLat()) / this.metadata.sizeLat())];
  }

  public float getOffset(
      Coordinate coordinate
  ) {
    return this.getOffset(coordinate.getX(), coordinate.getY());
  }

}
