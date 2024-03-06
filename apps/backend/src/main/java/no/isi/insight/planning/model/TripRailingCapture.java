package no.isi.insight.planning.model;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@Table(name = TripRailingCapture.TABLE_NAME)
public class TripRailingCapture {

  public static final String TABLE_NAME = "trip_railing_capture";
  public static final String PRIMARY_KEY = "trip_railing_capture_id";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = PRIMARY_KEY)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "fk_trip_id", referencedColumnName = Trip.PRIMARY_KEY)
  private Trip trip;

  @ManyToOne
  @JoinColumn(name = "fk_road_railing_id", referencedColumnName = RoadRailing.PRIMARY_KEY)
  private RoadRailing railing;

  @Column(name = "sequence_number")
  private int sequenceNumber;

  @Column(name = "captured_at")
  private LocalDateTime capturedAt;

  @Column(name = "position")
  private Point position;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "image_urls")
  private Map<String, String> imageUrls;

  public TripRailingCapture(
      Trip trip,
      RoadRailing railing,
      int sequenceNumber,
      LocalDateTime capturedAt,
      Point position,
      Map<String, String> imageUrls
  ) {
    this.trip = trip;
    this.railing = railing;
    this.sequenceNumber = sequenceNumber;
    this.capturedAt = capturedAt;
    this.position = position;
    this.imageUrls = imageUrls;
  }

}
