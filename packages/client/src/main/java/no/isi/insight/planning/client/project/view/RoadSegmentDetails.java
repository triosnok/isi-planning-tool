package no.isi.insight.planning.client.project.view;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@Builder
@GenerateTypeScript
public record RoadSegmentDetails(
  UUID id,
  String railing,
  String geometry,
  String direction,
  String side,
  LocalDate lastImportedAt
) {}
