import { CacheKey } from '@/api';
import { DeviationCount, DeviationDetails } from '@isi-insight/client';
import { createQuery } from '@tanstack/solid-query';
import axios from 'axios';
import { Accessor } from 'solid-js';

export const useDeviationCountsQuery = () => {
  return createQuery(() => ({
    queryKey: [CacheKey.DEVIATION_COUNTS],
    queryFn: async () => {
      const response = await axios.get<DeviationCount[]>(
        `/api/v1/deviations/counts`
      );

      return response.data;
    },
  }));
};

export const useDeviationsQuery = (
  projectId: Accessor<string | undefined>,
  planIds: Accessor<string[]>,
  tripId: Accessor<string | undefined>,
  railingId: Accessor<number | undefined>,
  segmentId: Accessor<string | undefined>
) => {
  return createQuery(() => ({
    queryKey: [
      CacheKey.DEVIATION_LIST,
      projectId(),
      planIds(),
      tripId(),
      railingId(),
      segmentId(),
    ] as const,
    queryFn: async ({ signal, queryKey }) => {
      const [, projectId, planIds, tripId, railingId, segmentId] = queryKey;

      const params = new URLSearchParams();

      if (projectId) params.set('projectId', projectId);
      if (planIds.length > 0) params.set('planId', planIds.join(','));
      if (tripId) params.set('tripId', tripId);
      if (railingId) params.set('railingId', railingId.toString());
      if (segmentId) params.set('segmentId', segmentId);

      const response = await axios.get<DeviationDetails[]>(
        `/api/v1/deviations?${params.toString()}`,
        { signal }
      );

      return response.data;
    },
  }));
};
