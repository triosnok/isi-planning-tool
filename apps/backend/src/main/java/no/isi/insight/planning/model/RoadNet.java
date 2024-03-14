package no.isi.insight.planning.model;

import java.time.LocalDateTime;
import java.util.UUID;

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
@Table(name = "road_net")
public class RoadNet {

  public static final String PRIMARY_KEY = "road_net_id";

  @Id
  @Column(name = PRIMARY_KEY)
  private UUID id;

  @Column(name = "external_id")
  private Long externalId;

  @Column(name = "geometry")
  private LineString geometry;

  @UpdateTimestamp
  @Column(name = "last_imported_at")
  private LocalDateTime lastImportedAt;

  public RoadNet(
      Long externalId,
      LineString lineString
  ) {
    this.externalId = externalId;
    this.geometry = lineString;
  }

}
