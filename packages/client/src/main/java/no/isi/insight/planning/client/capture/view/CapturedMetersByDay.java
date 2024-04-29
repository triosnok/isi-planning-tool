package no.isi.insight.planning.client.capture.view;

import java.time.LocalDate;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record CapturedMetersByDay(LocalDate date, double meters) {}
