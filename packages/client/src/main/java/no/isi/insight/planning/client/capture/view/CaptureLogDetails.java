package no.isi.insight.planning.client.capture.view;

import java.time.LocalDateTime;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CaptureLogDetails(String name, LocalDateTime updatedAt, Long size) {}
