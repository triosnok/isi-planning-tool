package no.isi.insight.planning.trip.event;

import no.isi.insight.planning.db.model.Trip;

public record TripStartedEvent(Trip trip, String captureLogId, Integer replaySpeed) {}
