package no.isi.insight.planning.position.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.context.event.EventListener;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.capture.event.CaptureDetailsEvent;
import no.isi.insight.planning.client.position.view.PositionEvent;
import no.isi.insight.planning.client.position.view.PositionSubject;
import no.isi.insight.planning.position.model.PositionKey;
import no.isi.insight.planning.position.model.PositionSubscription;

@Slf4j
@Service
@RequiredArgsConstructor
public class PositionService {
  private final ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor();
  private final Map<PositionSubscription, List<SseEmitter>> emitters = new HashMap<>();
  private final Map<PositionKey, PositionEvent> positions = new HashMap<>();

  public SseEmitter createEmitter(
      PositionSubscription subscription
  ) {
    var emitter = new SseEmitter(Long.MAX_VALUE);

    this.emitters.computeIfAbsent(subscription, key -> {
      var list = new ArrayList<SseEmitter>();
      this.executorService.submit(() -> this.emitEvents(subscription));
      return list;
    }).add(emitter);

    emitter.onCompletion(() -> this.emitterCompleted(subscription, emitter));

    return emitter;
  }

  private void emitterCompleted(
      PositionSubscription subscription,
      SseEmitter emitter
  ) {
    this.emitters.get(subscription).remove(emitter);
    this.emitters.entrySet().removeIf(entry -> entry.getValue().isEmpty());
  }

  /**
   * Continuously emits events to the emitters for a given subscription.
   * 
   * @param subscription the subscription to emit events for
   */
  private void emitEvents(
      PositionSubscription subscription
  ) {
    while (true) {
      // ends the loop, happens if no more subscriptions are present
      var emitters = this.emitters.get(subscription);
      if (emitters == null) {
        break;
      }

      try {
        var positions = this.positions.entrySet()
          .stream()
          .filter(e -> subscription.subscribesTo(e.getKey()))
          .map(e -> e.getValue())
          .toList();

        var event = SseEmitter.event().name("message").data(positions, MediaType.APPLICATION_JSON);

        for (var emitter : emitters) {
          emitter.send(event);
        }

        Thread.sleep(1000L);
      } catch (AsyncRequestNotUsableException e) {
        // ignored, happens rather frequent - probably related to the client reconnecting
      } catch (IllegalStateException e) {
        // ignored, happens when emitter is already completed (e.g. when user changes page)
      } catch (Exception e) {
        log.error("Error in position subscription", e);
      }
    }
  }

  @EventListener(classes = CaptureDetailsEvent.class)
  void onCapture(
      CaptureDetailsEvent event
  ) {
    if (event.details().isEmpty()) {
      return;
    }

    var driver = event.trip().getDriver();
    var vehicle = event.trip().getVehicle();
    var driverKey = new PositionKey(
      PositionSubject.DRIVER,
      driver.getUserAccountId()
    );

    var vehicleKey = new PositionKey(
      PositionSubject.VEHICLE,
      vehicle.getId()
    );

    var positionEvent = PositionEvent.builder()
      .driverId(driver.getUserAccountId())
      .vehicleId(vehicle.getId())
      .tripId(event.trip().getId())
      .geometry(event.details().get().position())
      .heading(event.details().get().heading())
      .build();

    this.positions.put(driverKey, positionEvent);
    this.positions.put(vehicleKey, positionEvent);
  }

}
