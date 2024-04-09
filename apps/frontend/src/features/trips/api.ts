import { CacheKey } from '@/api';
import {
  CaptureAction,
  CaptureActionRequest,
  CaptureDetails,
  CaptureLogDetails,
  CreateTripNoteRequest,
  CreateTripRequest,
  TripDetails,
  TripNoteDetails,
} from '@isi-insight/client';
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import axios from 'axios';
import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';
import { z } from 'zod';

export const TripSchema = z.object({
  tripId: z.string().optional(),
  planId: z.string().optional(),
  startedAt: z.date().optional(),
  endedAt: z.date().optional(),
  gnssLog: z.string().optional(),
  cameraLogs: z.record(z.string()).optional(),
});

export type TripSchemaValues = z.infer<typeof TripSchema>;

export const useTripMutation = () => {
  const qc = useQueryClient();

  const onSuccess = (id: string) => {
    qc.invalidateQueries({ queryKey: [CacheKey.TRIP_LIST] });
    qc.invalidateQueries({
      queryKey: [CacheKey.TRIP_DETAILS, id],
    });
  };

  const create = createMutation(() => ({
    mutationFn: async (trip: CreateTripRequest) => {
      const response = await axios.post<TripDetails>('/api/v1/trips', trip);

      return response.data;
    },
  }));

  const update = createMutation(() => ({
    mutationFn: async (trip: TripSchemaValues) => {
      const response = await axios.put<TripDetails>(
        `/api/v1/trips/${trip.tripId}`,
        trip
      );

      return response.data;
    },
    onSuccess: (_data, _variables, _context) => {
      qc.invalidateQueries({
        queryKey: [CacheKey.TRIP_LIST, CacheKey.TRIP_DETAILS],
      });
    },
  }));

  return { create, update };
};

export const useTripDetailsQuery = (id: string) => {
  return createQuery(() => ({
    queryKey: [CacheKey.TRIP_DETAILS, id],
    queryFn: async () => {
      const response = await axios.get<TripDetails>(`/api/v1/trips/${id}`);

      return response.data;
    },
  }));
};

export const useTripsDetailsQuery = (
  projectId: string,
  selectedPlans: Accessor<string[]>
) => {
  return createQuery(() => ({
    queryKey: [CacheKey.TRIP_DETAILS, CacheKey.TRIP_LIST, selectedPlans()],
    queryFn: async () => {
      const planIds = selectedPlans();
      const response = await axios.get<TripDetails[]>(
        `/api/v1/trips?projectId=${projectId}&planId=${planIds.join('&planId=')}`
      );

      return response.data;
    },
  }));
};

export const useTripNoteMutation = (tripId: string) => {
  const qc = useQueryClient();

  const onSuccess = (id: string) => {
    qc.invalidateQueries({ queryKey: [CacheKey.TRIP_NOTE_LIST] });
    qc.invalidateQueries({
      queryKey: [CacheKey.TRIP_NOTE_DETAILS, id],
    });
  };

  const create = createMutation(() => ({
    mutationFn: async (note: CreateTripNoteRequest) => {
      const response = await axios.post(`/api/v1/trip-notes`, {
        ...note,
        tripId,
      });

      return response.data;
    },

    onSuccess: () => onSuccess(tripId),
  }));

  return { create };
};

export const useTripNoteDetailsQuery = (tripId: string) => {
  return createQuery(() => ({
    queryKey: [CacheKey.TRIP_NOTE_LIST],
    queryFn: async () => {
      const response = await axios.get<TripNoteDetails[]>(
        `/api/v1/trip-notes?tripId=${tripId}`
      );

      return response.data;
    },
  }));
};

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

//TODO: fix the rest of the caching issues here, its not ideal atm i think