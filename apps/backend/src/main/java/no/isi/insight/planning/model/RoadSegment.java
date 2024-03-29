package no.isi.insight.planning.model;

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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "road_segment")
public class RoadSegment {

  @Id
  @Column(name = "road_segment_id")
  private String id;

  @Id
  @ManyToOne
  @JoinColumn(name = "fk_road_railing_id", referencedColumnName = RoadRailing.PRIMARY_KEY)
  private RoadRailing railing;

  @Column(name = "geometry")
  private LineString geometry;

  @Enumerated(EnumType.STRING)
  @Column(name = "direction")
  private RoadDirection direction;

  @Enumerated(EnumType.STRING)
  @Column(name = "side")
  private RoadSide side;

  @UpdateTimestamp
  @Column(name = "last_imported_at")
  private LocalDateTime lastImportedAt;

  public RoadSegment(
      String id,
      RoadRailing railing,
      LineString lineString,
      RoadDirection direction,
      RoadSide side
  ) {
    this.id = id;
    this.railing = railing;
    this.geometry = lineString;
    this.direction = direction;
    this.side = side;
  }

}
