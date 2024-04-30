import { CacheKey } from '@/api';
import {
  CaptureAction,
  CaptureActionRequest,
  CaptureDetails,
  CaptureLogDetails,
  CapturedMetersByDay,
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
    queryKey: [CacheKey.CAPTURE_LOGS],
    queryFn: async () => {
      const response =
        await axios.get<CaptureLogDetails[]>(`/api/v1/capture/logs`);

      return response.data;
    },
  }));
};

export const CaptureLogSchema = z.object({
  logIdentifier: z.string().min(1, {
    message: 'Log identifier is required',
  }),
  gnssLog: z.instanceof(File),
  topCameraLog: z.instanceof(File),
  leftCameraLog: z.instanceof(File),
  rightCameraLog: z.instanceof(File),
});

export type CaptureLogSchemaValues = z.infer<typeof CaptureLogSchema>;

/**
 * Hook for uploading a capture log.
 */
export const useUploadCaptureLog = () => {
  const qc = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (values: {
      logIdentifier: string;
      gnssLog: File;
      topCameraLog: File;
      leftCameraLog: File;
      rightCameraLog: File;
    }) => {
      const formData = new FormData();
      formData.append('logIdentifier', values.logIdentifier);
      formData.append('gnssLog', values.gnssLog);
      formData.append('topCameraLog', values.topCameraLog);
      formData.append('leftCameraLog', values.leftCameraLog);
      formData.append('rightCameraLog', values.rightCameraLog);

      await axios.post<void>(`/api/v1/capture`, formData);
    },
    onSuccess: (_data, _variables, _context) => {
      qc.invalidateQueries({ queryKey: [CacheKey.CAPTURE_LOGS] });
    },
  }));
};

export const useCaptureMetersByDayQuery = () => {
  return createQuery(() => ({
    queryKey: [CacheKey.CAPTURE_METERS_BY_DAY],
    queryFn: async () => {
      const response = await axios.get<CapturedMetersByDay[]>(
        `/api/v1/capture/stats`
      );

      return response.data;
    },
  }));
};
