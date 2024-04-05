package no.isi.insight.planning.client.deviation.view;

import java.util.Map;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CreateDeviationRequest(
  @NotNull UUID captureId,
  @NotBlank String deviationType,
  @NotNull Map<String, String> details
) {}
