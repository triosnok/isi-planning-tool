package no.isi.insight.planning.model;

import java.util.ArrayList;
import java.util.List;

import org.locationtech.jts.geom.LineString;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Represents a road railing.
 */
@Getter
@Entity
@NoArgsConstructor
@Table(name = "road_railing")
public class RoadRailing {

  public static final String PRIMARY_KEY = "road_railing_id";

  @Id
  @Column(name = PRIMARY_KEY)
  private Long id;

  @Column(name = "geometry")
  private LineString geometry;

  @Column(name = "length")
  private Double length;

  @Column(name = "own_geometry")
  private boolean ownGeometry;

  @OneToMany(mappedBy = "railing")
  private List<RoadSegment> roadSegments = new ArrayList<>();

  public RoadRailing(
      Long id,
      LineString geometry,
      Double length
  ) {
    this.id = id;
    this.geometry = geometry;
    this.length = length;
  }

}
