package no.isi.insight.planning.db.model;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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
import no.isi.insight.planning.client.trip.view.CameraPosition;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "trip")
public class Trip {

  public static final String PRIMARY_KEY = "trip_id";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = PRIMARY_KEY)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "fk_vehicle_id", referencedColumnName = Vehicle.PRIMARY_KEY)
  private Vehicle vehicle;

  @ManyToOne
  @JoinColumn(name = "fk_driver_user_id", referencedColumnName = UserAccount.PRIMARY_KEY)
  private UserAccount driver;

  @ManyToOne
  @JoinColumn(name = "fk_project_plan_id", referencedColumnName = ProjectPlan.PRIMARY_KEY)
  private ProjectPlan projectPlan;

  @Column(name = "started_at")
  private LocalDateTime startedAt;

  @Column(name = "ended_at")
  private LocalDateTime endedAt;

  @Column(name = "gnss_log")
  private String gnssLog;

  @Column(name = "sequence_number")
  private int sequenceNumber;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "camera_logs")
  private Map<CameraPosition, String> cameraLogs;

  @Embedded
  private Audit audit;

  public Trip(
      Vehicle vehicle,
      UserAccount driver,
      ProjectPlan projectPlan,
      LocalDateTime startedAt,
      Integer sequenceNumber
  ) {
    this.vehicle = vehicle;
    this.driver = driver;
    this.projectPlan = projectPlan;
    this.startedAt = startedAt;
    this.sequenceNumber = sequenceNumber;
  }

  public boolean isEnded() {
    return this.endedAt != null;
  }

}
