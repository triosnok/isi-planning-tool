import { CacheKey } from '@/api';
import {
  CreateTripNoteRequest,
  CreateTripRequest,
  TripDetails,
  TripNoteDetails,
  UpdateTripNoteRequest,
} from '@isi-insight/client';
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import axios from 'axios';
import { Accessor } from 'solid-js';
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

  const onSuccess = (trip: TripDetails) => {
    qc.invalidateQueries({ queryKey: [CacheKey.TRIP_LIST] });
    qc.setQueryData([CacheKey.TRIP_DETAILS, trip.id], trip);
  };

  const create = createMutation(() => ({
    mutationFn: async (trip: CreateTripRequest) => {
      const response = await axios.post<TripDetails>('/api/v1/trips', trip);

      return response.data;
    },

    onSuccess: (data) => onSuccess(data),
  }));

  const update = createMutation(() => ({
    mutationFn: async (trip: TripSchemaValues) => {
      const response = await axios.put<TripDetails>(
        `/api/v1/trips/${trip.tripId}`,
        trip
      );

      return response.data;
    },

    onSuccess: (data) => onSuccess(data),
  }));

  return { create, update };
};

export const useTripDetailsQuery = (id: Accessor<string>) => {
  return createQuery(() => ({
    queryKey: [CacheKey.TRIP_DETAILS, id()] as const,
    queryFn: async ({ queryKey }) => {
      const [_, tripId] = queryKey;
      const response = await axios.get<TripDetails>(`/api/v1/trips/${tripId}`);

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

  const update = createMutation(() => ({
    mutationFn: async (request: {
      id: string;
      note: UpdateTripNoteRequest;
    }) => {
      const response = await axios.put<TripNoteDetails>(
        `/api/v1/trip-notes/${request.id}`,
        request.note
      );

      return response.data;
    },

    onSuccess: () => onSuccess(tripId),
  }));

  const deleteNote = createMutation(() => ({
    mutationFn: async (tripNoteId: string) => {
      const response = await axios.delete<TripNoteDetails>(
        `/api/v1/trip-notes/${tripNoteId}`
      );

      return response.status;
    },

    onSuccess: () => onSuccess(tripId),
  }));

  return { create, update, deleteNote };
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
