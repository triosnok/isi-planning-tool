import { CacheKey } from '@/api';
import type {
  CreateProjectRequest,
  CreateProjectResponse,
  ProjectDetails,
  ProjectStatus,
} from '@isi-insight/client';
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import axios from 'axios';

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
    queryFn: async () => axios.get<ProjectDetails>(`/api/v1/projects/${id}`),
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
