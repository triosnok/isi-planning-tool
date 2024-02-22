package no.isi.insight.planning.model;

import java.time.LocalDate;
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
  @Column(name = "railing_import_urls")
  private List<String> railingImportUrls;

  @Column(name = "starts_at")
  private LocalDate startsAt;

  @Column(name = "ends_at")
  private LocalDate endsAt;

  @ManyToMany
  @JoinTable(
    name = "project_plan_road_railing",
    joinColumns = @JoinColumn(name = "fk_project_plan_id", referencedColumnName = ProjectPlan.PRIMARY_KEY),
    inverseJoinColumns = @JoinColumn(name = "fk_road_railing_id", referencedColumnName = RoadRailing.PRIMARY_KEY)
  )
  private List<RoadRailing> railings;

  @Embedded
  private Audit audit;

  public ProjectPlan(
      Project project,
      List<String> railingImportUrls,
      LocalDate startsAt,
      LocalDate endsAt
  ) {
    this.project = project;
    this.railingImportUrls = railingImportUrls;
    this.startsAt = startsAt;
    this.endsAt = endsAt;
  }

  public void addRailingImportUrl(
      String url
  ) {
    this.railingImportUrls.add(url);
  }

}
