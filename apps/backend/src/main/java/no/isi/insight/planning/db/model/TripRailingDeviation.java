package no.isi.insight.planning.db.model;

import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

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
@Table(name = TripRailingDeviation.TABLE_NAME)
public class TripRailingDeviation {

  public static final String TABLE_NAME = "trip_railing_deviation";
  public static final String PRIMARY_KEY = "trip_railing_deviation_id";

  @Id
  @Column(name = PRIMARY_KEY)
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "fk_trip_railing_capture_id")
  private TripRailingCapture capture;

  @Column(name = "deviation_type")
  private String deviationType;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "details")
  private Map<String, String> details;

  public TripRailingDeviation(
      TripRailingCapture capture,
      String deviationType,
      Map<String, String> details
  ) {
    this.capture = capture;
    this.deviationType = deviationType;
    this.details = details;
  }

}
