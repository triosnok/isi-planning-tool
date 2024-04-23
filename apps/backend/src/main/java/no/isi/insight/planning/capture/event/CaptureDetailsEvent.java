package no.isi.insight.planning.capture.event;

import java.util.Optional;

import no.isi.insight.planning.client.capture.view.CaptureDetails;
import no.isi.insight.planning.db.model.Trip;

public record CaptureDetailsEvent(Trip trip, Optional<CaptureDetails> details) {}
