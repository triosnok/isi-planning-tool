package no.isi.insight.planning.vehicle.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.capture.event.CaptureDetailsEvent;
import no.isi.insight.planning.client.capture.view.CaptureDetails;
import no.isi.insight.planning.client.geometry.Geometry;

@Service
@RequiredArgsConstructor
public class VehiclePositionService {
  private Map<UUID, Geometry> positions = new HashMap<>();
  private List<SseEmitter> emitters = new ArrayList<>();

  @EventListener(classes = CaptureDetailsEvent.class)
  void onCapture(
      CaptureDetailsEvent event
  ) {
    var vehicle = event.trip().getVehicle();
    var geometry = event.details().map(CaptureDetails::position);

    if (geometry.isPresent()) {
      positions.put(vehicle.getId(), geometry.get());
    }
  }

}
