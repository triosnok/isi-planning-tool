import { CacheKey } from '@/api';
import {
  RoadRailing,
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

export const ProjectSchema = z.object({
  projectId: z.string().optional(),
  name: z.string().min(1),
  referenceCode: z.string(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
});

export type ProjectSchemaValues = z.infer<typeof ProjectSchema>;

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

  const update = createMutation(() => ({
    mutationFn: async (project: ProjectSchemaValues) => {
      const response = await axios.put<ProjectDetails>(
        `/api/v1/projects/${project.projectId}`,
        project
      );

      return response.data;
    },

    onSuccess: (response) => {
      qc.invalidateQueries({ queryKey: [CacheKey.PROJECT_LIST] });
      qc.invalidateQueries({
        queryKey: [CacheKey.PROJECT_DETAILS, response.id],
      });
    },
  }));

  return { create, update };
};

export const useProjectPlansMutation = (projectId: string) => {
  const qc = useQueryClient();

  const create = createMutation(() => ({
    mutationFn: async (plan: Omit<CreateProjectPlanRequest, 'projectId'>) => {
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
      qc.invalidateQueries({
        queryKey: [CacheKey.PROJECT_RAILINGS],
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
    queryKey: [CacheKey.PROJECT_RAILINGS, projectId()] as const,
    queryFn: async ({ queryKey }) => {
      const [_, projectId] = queryKey;

      if (projectId === undefined) return [];

      const response = await axios.get<RoadRailing[]>(
        `/api/v1/projects/${projectId}/railings`
      );

      return response.data;
    },
  }));
};
