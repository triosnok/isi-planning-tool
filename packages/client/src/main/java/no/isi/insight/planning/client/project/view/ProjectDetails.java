package no.isi.insight.planning.client.project.view;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@Builder
@GenerateTypeScript
public record ProjectDetails(
  UUID id,
  String name,
  String referenceCode,
  LocalDate startsAt,
  LocalDate endsAt,
  double capturedLength,
  double totalLength,
  int deviations,
  int notes
) {

  public ProjectStatus getStatus() {
    return ProjectStatus.fromDates(startsAt, endsAt);
  }

  public double getProgress() {
    if (totalLength == 0) {
      return 0;
    }

    return capturedLength / totalLength * 100;
  }

}
