package no.isi.insight.planning.capture.service;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.client.capture.view.ImageAnalysis;
import no.isi.insight.planning.client.capture.view.ImagePositionAnalysis;
import no.isi.insight.planning.client.capture.view.ImageRemark;
import no.isi.insight.planning.client.capture.view.ImageStatus;
import no.isi.insight.planning.client.trip.view.CameraPosition;

@Service
@RequiredArgsConstructor
public class ImageAnalysisService {

  private Map<ImageStatus, Integer> imageStatusOrdinal() {
    Map<ImageStatus, Integer> map = new EnumMap<>(ImageStatus.class);

    map.put(ImageStatus.OK, 0);
    map.put(ImageStatus.WITHIN_TOLERANCE, 1);
    map.put(ImageStatus.OUT_OF_TOLERANCE, 2);
    return map;
  }

  private ImageStatus[] imageStatusOrdinalReverseLookup = new ImageStatus[] {
      ImageStatus.OK, ImageStatus.WITHIN_TOLERANCE, ImageStatus.OUT_OF_TOLERANCE
  };

  public static final int TOLERANCE = 5;

  public ImageStatus getImageStatus(
      long count,
      long target,
      long tolerance
  ) {
    var deviation = Math.abs(count - target);

    if (deviation == 0)
      return ImageStatus.OK;
    if (deviation <= tolerance)
      return ImageStatus.WITHIN_TOLERANCE;

    return ImageStatus.OUT_OF_TOLERANCE;
  }

  public ImageAnalysis getImageAnalysis(
      Map<CameraPosition, Long> images
  ) {

    var topCount = Optional.ofNullable(images.get(CameraPosition.TOP)).orElse(0L);
    var leftCount = Optional.ofNullable(images.get(CameraPosition.LEFT)).orElse(0L);
    var rightCount = Optional.ofNullable(images.get(CameraPosition.RIGHT)).orElse(0L);

    var topTarget = Math.max(leftCount, rightCount) / 2;
    var sideTarget = Math.max(leftCount, rightCount);

    var topStatus = getImageStatus(topCount, topTarget, TOLERANCE);
    var leftStatus = getImageStatus(leftCount, sideTarget, TOLERANCE);
    var rightStatus = getImageStatus(rightCount, sideTarget, TOLERANCE);

    var overallStatus = Math.max(
      imageStatusOrdinal().get(topStatus),
      Math.max(imageStatusOrdinal().get(leftStatus), imageStatusOrdinal().get(rightStatus))
    );

    List<ImageRemark> remarks = new ArrayList<>();

    if (topStatus == ImageStatus.OUT_OF_TOLERANCE) {
      remarks.add(ImageRemark.TOP_SIDE_IMBALANCE);
    }

    if (leftStatus == ImageStatus.OUT_OF_TOLERANCE || rightStatus == ImageStatus.OUT_OF_TOLERANCE) {
      remarks.add(ImageRemark.LEFT_RIGHT_IMBALANCE);
    }

    ImageAnalysis imageAnalysis = getImageAnalysisResult(
      imageStatusOrdinalReverseLookup[overallStatus],
      remarks,
      topCount,
      topTarget,
      topStatus,
      leftCount,
      sideTarget,
      leftStatus,
      rightCount,
      rightStatus
    );

    return imageAnalysis;

  }

  public ImageAnalysis getImageAnalysisResult(
      ImageStatus overallStatus,
      List<ImageRemark> remarks,
      long topCount,
      long topTarget,
      ImageStatus topStatus,
      long leftCount,
      long sideTarget,
      ImageStatus leftStatus,
      long rightCount,
      ImageStatus rightStatus
  ) {
    Map<CameraPosition, ImagePositionAnalysis> positions = new EnumMap<>(CameraPosition.class);
    positions.put(
      CameraPosition.TOP,
      new ImagePositionAnalysis(
        topCount,
        topTarget,
        topStatus
      )
    );
    positions.put(
      CameraPosition.LEFT,
      new ImagePositionAnalysis(
        leftCount,
        sideTarget,
        leftStatus
      )
    );
    positions.put(
      CameraPosition.RIGHT,
      new ImagePositionAnalysis(
        rightCount,
        sideTarget,
        rightStatus
      )
    );

    return new ImageAnalysis(
      overallStatus,
      remarks,
      positions
    );
  }
}
