package no.isi.insight.planning.position.model;

import java.util.UUID;

import no.isi.insight.planning.client.position.view.PositionSubject;

public record PositionKey(PositionSubject subject, UUID subjectId) {}
