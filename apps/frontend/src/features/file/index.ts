import { FileUploadResponse } from '@isi-insight/client';
import { createMutation } from '@tanstack/solid-query';
import axios from 'axios';

export const useFileUploadMutation = (bucket: string) => {
  return createMutation(() => ({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<FileUploadResponse>(
        `/api/v1/file/${bucket}`,
        formData
      );

      return response.data;
    },
  }));
};
