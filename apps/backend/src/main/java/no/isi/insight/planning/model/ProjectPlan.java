package no.isi.insight.planning.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
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
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import no.isi.insight.planning.client.project.view.RailingImportDetails;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "project_plan")
public class ProjectPlan {

  public static final String PRIMARY_KEY = "project_plan_id";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = PRIMARY_KEY)
  private UUID id;

  @ManyToOne
  @JoinColumn(name = "fk_project_id", referencedColumnName = Project.PRIMARY_KEY)
  private Project project;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(name = "railing_imports")
  private List<RailingImportDetails> imports;

  @Setter
  @Column(name = "starts_at")
  private LocalDate startsAt;

  @Setter
  @Column(name = "ends_at")
  private LocalDate endsAt;

  @Setter
  @ManyToOne
  @JoinColumn(name = "fk_vehicle_id", referencedColumnName = Vehicle.PRIMARY_KEY)
  private Vehicle vehicle;

  @ManyToMany
  @JoinTable(
    name = "project_plan_road_railing",
    joinColumns = @JoinColumn(name = "fk_project_plan_id", referencedColumnName = ProjectPlan.PRIMARY_KEY),
    inverseJoinColumns = @JoinColumn(name = "fk_road_railing_id", referencedColumnName = RoadRailing.PRIMARY_KEY)
  )
  private List<RoadRailing> railings = new ArrayList<>();

  @Embedded
  private Audit audit;

  public ProjectPlan(
      Project project,
      LocalDate startsAt,
      LocalDate endsAt
  ) {
    this.project = project;
    this.startsAt = startsAt;
    this.endsAt = endsAt;
    this.imports = new ArrayList<>();
  }

  public void addRailingImport(
      RailingImportDetails importDetails
  ) {
    this.imports.add(importDetails);
  }

  public void addRailing(
      RoadRailing railing
  ) {
    this.railings.add(railing);
  }

  public void removeRailing(
      RoadRailing railing
  ) {
    this.railings.remove(railing);
  }

}
