package no.isi.insight.planning.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "project")
public class Project {

  public static final String PRIMARY_KEY = "project_id";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = PRIMARY_KEY)
  private UUID id;

  @Column(name = "name")
  private String name;

  @Column(name = "reference_code")
  private String referenceCode;

  @Column(name = "starts_at")
  private LocalDateTime startsAt;

  @Column(name = "ends_at")
  private LocalDateTime endsAt;

  @Embedded
  private Audit audit;

  public Project(
      String name,
      String referenceCode,
      LocalDateTime startsAt,
      LocalDateTime endsAt
  ) {
    this.name = name;
    this.referenceCode = referenceCode;
    this.startsAt = startsAt;
    this.endsAt = endsAt;
  }

}
