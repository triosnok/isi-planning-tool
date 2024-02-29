package no.isi.insight.planner.client.project.view;

import java.time.LocalDate;

import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public enum ProjectStatus {
  UPCOMING,
  ONGOING,
  PREVIOUS;

  public static ProjectStatus fromDates(
      LocalDate start,
      LocalDate end
  ) {
    var now = LocalDate.now();

    if (now.isBefore(start)) {
      return UPCOMING;
    } else if (end != null && now.isAfter(end)) {
      return PREVIOUS;
    } else {
      return ONGOING;
    }
  }
}
