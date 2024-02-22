package no.isi.insight.planning.model;

import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.LineString;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = PRIMARY_KEY)
  private UUID id;

  @Column(name = "external_id")
  private Long externalId;

  @Column(name = "geometry")
  private LineString geometry;

  @Column(name = "road_system_reference_id")
  private Long roadSystemReferenceId;

  @Column(name = "road_system_reference")
  private String roadSystemReference;

  @Column(name = "length")
  private Double length;

  @Enumerated(EnumType.STRING)
  @JdbcTypeCode(SqlTypes.NAMED_ENUM)
  @Column(name = "direction_of_road")
  private RoadDirection direction;

  @Enumerated(EnumType.STRING)
  @JdbcTypeCode(SqlTypes.NAMED_ENUM)
  @Column(name = "side_of_road")
  private RoadSide side;

  public RoadRailing(
      Long externalId,
      LineString geometry,
      Long roadSystemReferenceId,
      String roadSystemReference,
      Double length,
      RoadDirection direction,
      RoadSide side
  ) {
    this.externalId = externalId;
    this.geometry = geometry;
    this.roadSystemReferenceId = roadSystemReferenceId;
    this.roadSystemReference = roadSystemReference;
    this.length = length;
    this.direction = direction;
    this.side = side;
  }

}
