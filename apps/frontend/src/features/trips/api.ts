import { CacheKey } from '@/api';
import {
  CreateTripNoteRequest,
  CreateTripRequest,
  TripDetails
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
  const create = createMutation(() => ({
    mutationFn: async (note: CreateTripNoteRequest) => {
      const response = await axios.post(`/api/v1/trip-notes`, {
        ...note,
        tripId,
      });

      return response.data;
    },
  }));

  return { create };
};
