import { CacheKey } from '@/api';
import {
  DeviationCount
} from '@isi-insight/client';
import { createQuery } from '@tanstack/solid-query';
import axios from 'axios';

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
