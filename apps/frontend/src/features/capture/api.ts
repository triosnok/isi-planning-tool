import { CacheKey } from '@/api';
import {
  CaptureAction,
  CaptureActionRequest,
  CaptureDetails,
  CaptureLogDetails,
} from '@isi-insight/client';
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import axios from 'axios';
import { createEffect, createSignal, onCleanup } from 'solid-js';
import { z } from 'zod';

/**
 * Hook for performing action on a trips capture.
 *
 * @param tripId id of the trip to perform actions on
 */
export const useTripCaptureAction = (tripId: string) => {
  return createMutation(() => ({
    mutationFn: async (action: CaptureAction) => {
      const request: CaptureActionRequest = {
        action,
        tripId,
      };

      await axios.post<void>(`/api/v1/capture/actions`, request);
    },
  }));
};

/**
 * Hook for listening to the changes in capture details for a trip.
 *
 * @param tripId id of the trip to listen to
 */
export const useTripCaptureDetails = (tripId: string) => {
  const [details, setDetails] = createSignal<CaptureDetails>();

  createEffect(() => {
    const es = new EventSource(`/api/v1/capture/stream?tripId=${tripId}`);

    es.addEventListener('message', (event: MessageEvent<string>) => {
      const details: CaptureDetails = JSON.parse(event.data);
      setDetails(details);
    });

    es.addEventListener('ended', () => es.close());

    onCleanup(() => {
      if (es.readyState !== es.CLOSED) es.close();
    });
  });

  return details;
};

/**
 * Hook for querying capture logs, retrieving the list of stored capture logs.
 */
export const useCaptureLogsQuery = () => {
  return createQuery(() => ({
    queryKey: [],
    queryFn: async () => {
      const response =
        await axios.get<CaptureLogDetails[]>(`/api/v1/capture/logs`);

      return response.data;
    },
  }));
};
