package no.isi.insight.planning.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.LineString;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "road_segment")
public class RoadSegment {

  public static final String PRIMARY_KEY = "road_segment_id";

  @Id
  @Column(name = PRIMARY_KEY)
  private String id;

  @Column(name = "geometry")
  private LineString geometry;

  @UpdateTimestamp
  @Column(name = "last_imported_at")
  private LocalDateTime lastImportedAt;

  public RoadSegment(
      String id,
      LineString lineString
  ) {
    this.id = id;
    this.geometry = lineString;
  }

}
