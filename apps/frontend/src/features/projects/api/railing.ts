import { CacheKey } from '@/api';
import { RailingCapture, RoadRailing, RoadSegment } from '@isi-insight/client';
import { createQuery } from '@tanstack/solid-query';
import axios from 'axios';
import { Accessor } from 'solid-js';

export const useRailingsQuery = () => {};

export const useRailingDetailsQuery = (
  railingId: Accessor<number | undefined>
) => {
  return createQuery(() => ({
    queryKey: [CacheKey.RAILING_DETAILS, railingId()] as const,
    queryFn: async ({ queryKey }) => {
      const [_, railingId] = queryKey;

      if (railingId === undefined) return null;

      const response = await axios.get<RoadRailing>(
        `/api/v1/railings/${railingId}`
      );
      return response.data;
    },
  }));
};

export const useRailingRoadSegmentsQuery = (
  railingId: Accessor<number | undefined>
) => {
  return createQuery(() => ({
    queryKey: [CacheKey.RAILING_ROAD_SEGMENTS, railingId()] as const,
    queryFn: async ({ queryKey, signal }) => {
      const [_, railingId] = queryKey;

      const response = await axios.get<RoadSegment[]>(
        `/api/v1/railings/${railingId}/segments`,
        { signal }
      );

      return response.data;
    },
  }));
};

export const useRailingCaptureQuery = (
  railingId: Accessor<number | undefined>,
  segmentId: Accessor<string | undefined>,
  segmentIndex: Accessor<number | undefined>
) => {
  return createQuery(() => ({
    queryKey: [
      CacheKey.RAILING_CAPTURE,
      railingId(),
      segmentId(),
      segmentIndex(),
    ],
    queryFn: async ({ queryKey, signal }) => {
      const [_, railingId, segmentId, segmentIndex] = queryKey;
      if (!railingId || !segmentId || segmentIndex === undefined) return [];

      const params = new URLSearchParams();

      params.set('segmentIndex', segmentIndex.toString());

      const response = await axios.get<RailingCapture[]>(
        `/api/v1/railings/${railingId}/${segmentId}/capture?${params.toString()}`,
        { signal }
      );

      return response.data;
    },
  }));
};
