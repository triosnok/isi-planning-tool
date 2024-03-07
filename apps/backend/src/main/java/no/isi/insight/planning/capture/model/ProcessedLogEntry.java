package no.isi.insight.planning.capture.model;

import java.time.LocalDateTime;
import java.util.Map;

import org.locationtech.jts.geom.Point;

public record ProcessedLogEntry(Point point, LocalDateTime timestamp, Map<CameraPosition, String> images) {}
