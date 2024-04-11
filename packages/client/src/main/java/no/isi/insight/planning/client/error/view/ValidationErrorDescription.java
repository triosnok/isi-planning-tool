package no.isi.insight.planning.client.error.view;

import lombok.Builder;

@Builder
public record ValidationErrorDescription(String message) {}
