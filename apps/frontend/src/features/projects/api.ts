import { CacheKey } from '@/api';
import {
  CreateTripNoteRequest,
  CreateTripRequest,
  RoadRailing,
  TripDetails,
  type CreateProjectPlanRequest,
  type CreateProjectPlanResponse,
  type CreateProjectRequest,
  type CreateProjectResponse,
  type ProjectDetails,
  type ProjectPlanDetails,
  type ProjectStatus,
} from '@isi-insight/client';
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import axios from 'axios';
import { Accessor } from 'solid-js';
import { z } from 'zod';

export const useProjectsQuery = (status?: ProjectStatus) => {
  const params = new URLSearchParams();
  if (status !== undefined) {
    params.set('status', status);
  }

  return createQuery(() => ({
    queryKey: [CacheKey.PROJECT_LIST, status],
    queryFn: async () => {
      const response = await axios.get<ProjectDetails[]>(
        `/api/v1/projects?${params.toString()}`
      );

      return response.data;
    },
  }));
};

export const useProjectDetailsQuery = (id: string) => {
  return createQuery(() => ({
    queryKey: [CacheKey.PROJECT_DETAILS, id],
    queryFn: async () => {
      const response = await axios.get<ProjectDetails>(
        `/api/v1/projects/${id}`
      );

      return response.data;
    },
  }));
};

export const useProjectsMutation = () => {
  const qc = useQueryClient();

  const create = createMutation(() => ({
    mutationFn: async (project: CreateProjectRequest) => {
      const response = await axios.post<CreateProjectResponse>(
        '/api/v1/projects',
        project
      );

      return response.data;
    },

    onSuccess: (response) => {
      qc.invalidateQueries({ queryKey: [CacheKey.PROJECT_LIST] });
      qc.invalidateQueries({
        queryKey: [CacheKey.PROJECT_DETAILS, response.projectId],
      });
    },
  }));

  return { create };
};

export const useProjectPlansMutation = (projectId: string) => {
  const qc = useQueryClient();

  const create = createMutation(() => ({
    mutationFn: async (plan: CreateProjectPlanRequest) => {
      const response = await axios.post<CreateProjectPlanResponse>(
        `/api/v1/project-plans`,
        {
          ...plan,
          projectId,
        }
      );

      return response.data;
    },

    onSuccess: (response) => {
      qc.invalidateQueries({ queryKey: [CacheKey.PROJECT_PLAN_LIST] });
      qc.invalidateQueries({
        queryKey: [CacheKey.PROJECT_PLAN_DETAILS, response.projectPlanId],
      });
    },
  }));

  return { create };
};

export const useProjectPlansQuery = (projectId: string) => {
  return createQuery(() => ({
    queryKey: [CacheKey.PROJECT_PLAN_LIST, projectId],
    queryFn: async () => {
      const response = await axios.get<ProjectPlanDetails[]>(
        `/api/v1/project-plans?projectId=${projectId}`
      );

      return response.data;
    },
  }));
};

export const useProjectRailings = (projectId: Accessor<string | undefined>) => {
  return createQuery(() => ({
    queryKey: [projectId()] as const,
    queryFn: async ({ queryKey }) => {
      const [projectId] = queryKey;

      if (projectId === undefined) return [];

      const response = await axios.get<RoadRailing[]>(
        `/api/v1/projects/${projectId}/railings`
      );

      return response.data;
    },
  }));
};

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
      const response = await axios.post(
        `/api/v1/trip-notes?tripId=${tripId}`,
        note
      );

      return response.data;
    },
  }));

  return { create };
};
