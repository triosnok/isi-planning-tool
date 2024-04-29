package no.isi.insight.planning.client.capture.view;

import java.util.List;
import java.util.Map;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.trip.view.CameraPosition;

@GenerateTypeScript
public record ImageAnalysis(
  ImageStatus overall,
  List<ImageRemark> remarks,
  Map<CameraPosition, ImagePositionAnalysis> positions
) {

}
