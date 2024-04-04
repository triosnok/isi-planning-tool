package no.isi.insight.planning.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@Table(name = RoadSystem.TABLE_NAME)
public class RoadSystem {

  public static final String TABLE_NAME = "road_system";
  public static final String PRIMARY_KEY = "road_system_id";

  @Id
  @Column(name = PRIMARY_KEY)
  private Long id;

  @Column(name = "road_category")
  private String category;

  @Column(name = "road_phase")
  private String phase;

  @Column(name = "road_number")
  private Integer roadNumber;

  @Column(name = "last_imported_at")
  private LocalDateTime lastImportedAt;

  public RoadSystem(
      Long id,
      String category,
      String phase
  ) {
    this.id = id;
    this.category = category;
    this.phase = phase;
    this.lastImportedAt = LocalDateTime.now();
  }

}
