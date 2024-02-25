import type {
  CreateProjectRequest,
  CreateProjectResponse,
} from '@isi-insight/client';
import { createMutation } from '@tanstack/solid-query';
import axios from 'axios';

export const useNewProjectMutation = () => {
  return createMutation(() => ({
    mutationFn: async (data: CreateProjectRequest) => {
      const response = await axios.post<CreateProjectResponse>(
        '/api/v1/projects',
        data
      );

      return response.data;
    },
    onSuccess: (response) => {
      // todo: navigate to project
    },
  }));
};
