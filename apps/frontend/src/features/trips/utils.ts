import { CameraPosition, CaptureDetails } from '@isi-insight/client';

export enum ImageStatus {
  OK = 'OK',
  WITHIN_TOLERANCE = 'WITHIN_TOLERANCE',
  OUT_OF_TOLERANCE = 'OUT_OF_TOLERANCE',
}

export enum ImageRemark {
  LEFT_RIGHT_IMBALANCE = 'LEFT_RIGHT_IMBALANCE',
  TOP_SIDE_IMBALANCE = 'TOP_SIDE_IMBALANCE',
}

const IMAGE_STATUS_ORDINAL: { [k in ImageStatus]: number } = {
  [ImageStatus.OK]: 0,
  [ImageStatus.WITHIN_TOLERANCE]: 1,
  [ImageStatus.OUT_OF_TOLERANCE]: 2,
};

const IMAGE_STATUS_ORDINAL_REVERSE_LOOKUP: { [k: number]: ImageStatus } = {
  [IMAGE_STATUS_ORDINAL[ImageStatus.OK]]: ImageStatus.OK,
  [IMAGE_STATUS_ORDINAL[ImageStatus.WITHIN_TOLERANCE]]:
    ImageStatus.WITHIN_TOLERANCE,
  [IMAGE_STATUS_ORDINAL[ImageStatus.OUT_OF_TOLERANCE]]:
    ImageStatus.OUT_OF_TOLERANCE,
};

export interface ImagePositionAnalysis {
  count: number;
  target: number;
  status: ImageStatus;
}

export interface ImageAnalysis {
  overall: ImageStatus;
  remarks: ImageRemark[];
  positions: { [k in CameraPosition]: ImagePositionAnalysis };
}

export const TOLERANCE = 5;

/**
 * Returns the status of an image position based on the count of images, the target count, and the tolerance.
 *
 * @param count the current count of images
 * @param target the target/wanted count of images
 * @param tolerance the tolerance for the count of images
 *
 * @returns the status of the image position
 */
const getImageStatus = (
  count: number,
  target: number,
  tolerance: number
): ImageStatus => {
  const deviation = Math.abs(count - target);

  if (deviation === 0) return ImageStatus.OK;
  if (deviation <= tolerance) return ImageStatus.WITHIN_TOLERANCE;

  return ImageStatus.OUT_OF_TOLERANCE;
};

/**
 * Processes the image analysis for a given set of images, returning statuses for the different positions.
 *
 * @param images the images to analyze
 *
 * @returns the image analysis
 */
export const getImageAnalysis = (
  images: CaptureDetails['images']
): ImageAnalysis => {
  const topCount = images.TOP ?? 0;
  const leftCount = images.LEFT ?? 0;
  const rightCount = images.RIGHT ?? 0;

  const topTarget = Math.max(leftCount, rightCount) / 2;
  const sideTarget = Math.max(leftCount, rightCount);

  const topStatus = getImageStatus(topCount, topTarget, TOLERANCE);
  const leftStatus = getImageStatus(leftCount, sideTarget, TOLERANCE);
  const rightStatus = getImageStatus(rightCount, sideTarget, TOLERANCE);

  const overallStatus = Math.max(
    IMAGE_STATUS_ORDINAL[topStatus],
    IMAGE_STATUS_ORDINAL[leftStatus],
    IMAGE_STATUS_ORDINAL[rightStatus]
  );

  const remarks: ImageRemark[] = [];

  if (topStatus === ImageStatus.OUT_OF_TOLERANCE) {
    remarks.push(ImageRemark.TOP_SIDE_IMBALANCE);
  }

  if (
    leftStatus === ImageStatus.OUT_OF_TOLERANCE ||
    rightStatus === ImageStatus.OUT_OF_TOLERANCE
  ) {
    remarks.push(ImageRemark.LEFT_RIGHT_IMBALANCE);
  }

  return {
    overall: IMAGE_STATUS_ORDINAL_REVERSE_LOOKUP[overallStatus],
    remarks,
    positions: {
      TOP: {
        count: topCount,
        target: topTarget,
        status: topStatus,
      },
      LEFT: {
        count: leftCount,
        target: sideTarget,
        status: leftStatus,
      },
      RIGHT: {
        count: rightCount,
        target: sideTarget,
        status: rightStatus,
      },
    },
  };
};
