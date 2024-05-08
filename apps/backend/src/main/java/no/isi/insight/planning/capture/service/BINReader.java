package no.isi.insight.planning.capture.service;

import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

import org.locationtech.jts.geom.Coordinate;

/**
 * Reader for BIN files following the Gravsoft BIN format. The BIN format is divided into blocks of
 * 64 bytes, with the first block being a metadata block consisting of information present in
 * {@link BINMetadata}.
 * 
 * The data blocks form a grid where rows are the along the lines of latitude, and columns are along
 * the lines of longitude. The 64 byte data blocks are divided into 16 floating point numbers.
 * 
 * @see https://www.kartverket.no/api-og-data/separasjonsmodellar/python-kode-som-les-inn-bin-filer
 *      reference implementation
 */
public class BINReader {
  private final BINMetadata metadata;
  private final float[][] grid;

  public BINReader(
      InputStream in
  ) throws Exception {
    var buffer = ByteBuffer.wrap(in.readAllBytes()).order(ByteOrder.LITTLE_ENDIAN);
    var icode = buffer.getInt();

    if (icode != 777) {
      throw new IllegalStateException("Invalid BIN file: icode is not 777, got: %s".formatted(icode));
    }

    this.metadata = new BINMetadata(
      buffer.getDouble(),
      buffer.getDouble(),
      buffer.getDouble(),
      buffer.getDouble(),
      buffer.getDouble(),
      buffer.getDouble(),
      buffer.getInt(),
      buffer.getInt(),
      buffer.getInt()
    );

    var nlon = (int) Math.round((this.metadata.maxLon() - this.metadata.minLon()) / this.metadata.sizeLon()) + 1;
    var nlat = (int) Math.round((this.metadata.maxLat() - this.metadata.minLat()) / this.metadata.sizeLat()) + 1;

    var n = buffer.remaining() / 4;
    var nlonZeros = n / nlat;

    if ((n - nlon * nlat) / (nlonZeros - nlon) != nlat) {
      throw new IllegalArgumentException("Unexpected amount of data points in the grid");
    }

    this.grid = new float[nlat][nlonZeros];

    for (int lat = 0; lat < nlat; lat++) {
      for (int lon = 0; lon < nlonZeros; lon++) {
        this.grid[lat][lon] = buffer.getFloat();
      }
    }
  }

  /**
   * Returns the metadata of the BIN file.
   * 
   * @return the metadata
   */
  public BINMetadata getMetadata() {
    return this.metadata;
  }

  /**
   * Get the height offset for a given longitude and latitude.
   * 
   * @param latitude  the latitude
   * @param longitude the longitude
   * 
   * @return the height offset
   */
  public float getOffset(
      double latitude,
      double longitude
  ) {
    if (latitude < this.metadata.minLat() || latitude > this.metadata.maxLat()) {
      throw new IllegalArgumentException("Latitude out of bounds: %s".formatted(latitude));
    }

    if (longitude < this.metadata.minLon() || longitude > this.metadata.maxLon()) {
      throw new IllegalArgumentException("Longitude out of bounds: %s".formatted(longitude));
    }

    var latIdx = (int) Math.round((this.metadata.maxLat() - latitude) / this.metadata.sizeLat());
    var lonIdx = (int) Math.round((longitude - this.metadata.minLon()) / this.metadata.sizeLon());

    return this.grid[latIdx][lonIdx];
  }

  /**
   * Get the height offset for a given coordinate.
   * 
   * @param coordinate the coordinate
   * 
   * @return the height offset
   */
  public float getOffset(
      Coordinate coordinate
  ) {
    return this.getOffset(coordinate.getY(), coordinate.getX());
  }

}
