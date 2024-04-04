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
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import no.isi.insight.planning.client.trip.view.CameraPosition;

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
  @JoinColumns({
      @JoinColumn(name = "fk_road_railing_id", referencedColumnName = "fk_road_railing_id"),
      @JoinColumn(name = "fk_road_segment_id", referencedColumnName = "road_segment_id")
  })
  private RoadSegment roadSegment;

  @Column(name = "captured_at")
  private LocalDateTime capturedAt;

  @Column(name = "position")
  private Point position;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "image_urls")
  private Map<CameraPosition, String> imageUrls;

  public TripRailingCapture(
      Trip trip,
      RoadSegment segment,
      LocalDateTime capturedAt,
      Point position,
      Map<CameraPosition, String> imageUrls
  ) {
    this.trip = trip;
    this.roadSegment = segment;
    this.capturedAt = capturedAt;
    this.position = position;
    this.imageUrls = imageUrls;
  }

  public RoadRailing getRailing() {
    return this.roadSegment.getRailing();
  }

}
