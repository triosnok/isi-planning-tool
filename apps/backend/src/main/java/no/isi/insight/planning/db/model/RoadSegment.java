package no.isi.insight.planning.db.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.LineString;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@Table(name = "road_segment")
public class RoadSegment {

  @Id
  @EqualsAndHashCode.Include
  @Column(name = "road_segment_id")
  private String id;

  @Id
  @ManyToOne
  @EqualsAndHashCode.Include
  @JoinColumn(name = "fk_road_railing_id", referencedColumnName = RoadRailing.PRIMARY_KEY)
  private RoadRailing railing;

  @Column(name = "geometry")
  private LineString geometry;

  @Column(name = "length")
  private double length;

  @Enumerated(EnumType.STRING)
  @Column(name = "direction_of_road")
  private RoadDirection direction;

  @Enumerated(EnumType.STRING)
  @Column(name = "side_of_road")
  private RoadSide side;

  @Column(name = "road_category")
  private String roadCategory;

  @Column(name = "road_system_reference")
  private String roadSystemReference;

  @Column(name = "road_reference")
  private String roadReference;

  @UpdateTimestamp
  @Column(name = "last_imported_at")
  private LocalDateTime lastImportedAt;

  public RoadSegment(
      String id,
      RoadRailing railing,
      LineString lineString,
      double length,
      RoadDirection direction,
      RoadSide side
  ) {
    this.id = id;
    this.railing = railing;
    this.length = length;
    this.geometry = lineString;
    this.direction = direction;
    this.side = side;
  }

}
