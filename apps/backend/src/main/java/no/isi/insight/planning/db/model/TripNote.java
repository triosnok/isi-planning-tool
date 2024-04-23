package no.isi.insight.planning.db.model;

import java.util.UUID;

import org.locationtech.jts.geom.Point;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "trip_note")
public class TripNote {

  public static final String PRIMARY_KEY = "trip_note_id";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = PRIMARY_KEY)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "fk_trip_id", referencedColumnName = Trip.PRIMARY_KEY)
  private Trip trip;

  @Column(name = "note")
  private String note;

  @Column(name = "position")
  private Point position;

  @Embedded
  private Audit audit;

  public TripNote(
      Trip trip,
      String note,
      Point position
  ) {
    this.trip = trip;
    this.note = note;
    this.position = position;
  }
}
