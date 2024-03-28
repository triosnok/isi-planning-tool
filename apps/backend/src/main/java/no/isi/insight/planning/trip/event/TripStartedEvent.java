package no.isi.insight.planning.trip.event;

import java.util.UUID;

public record TripStartedEvent(UUID tripId, String captureLogId, Integer replaySpeed) {}
