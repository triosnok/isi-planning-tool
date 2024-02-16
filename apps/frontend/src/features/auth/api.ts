import { ACCESS_TOKEN_LOCALSTORAGE_KEY, CacheKey } from '@/api';
import type {
  SignInRequest,
  SignInResponse,
  UserProfile,
} from '@isi-insight/client';
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import axios from 'axios';

/**
 * Hook for fetching the user profile.
 */
export const useProfile = () => {
  return createQuery(() => ({
    retry: () => localStorage.getItem(ACCESS_TOKEN_LOCALSTORAGE_KEY) !== null,
    queryKey: [CacheKey.USER_PROFILE],
    queryFn: async () => {
      const response = await axios.get<UserProfile>('api/v1/auth/profile');
      return response.data;
    },
  }));
};

/**
 * Hook for signing in a user.
 */
export const useSignInMutation = () => {
  const qc = useQueryClient();

  return createMutation(() => ({
    mutationFn: async (data: SignInRequest) => {
      const response = await axios.post<SignInResponse>(
        '/api/v1/auth/sign-in',
        data
      );

      return response.data;
    },
    onSuccess: (response) => {
      localStorage.setItem(ACCESS_TOKEN_LOCALSTORAGE_KEY, response.accessToken);
      qc.refetchQueries({ queryKey: [CacheKey.USER_PROFILE] });
    },
  }));
};

/**
 * Hook for refreshing the access token.
 */
export const useRefreshTokenMutation = () => {
  const qc = useQueryClient();

  return createQuery(() => ({
    queryKey: [],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      const response = await axios.get<SignInResponse>('/api/v1/auth/refresh');
      return response.data;
    },
    onSuccess: (response) => {
      localStorage.setItem(ACCESS_TOKEN_LOCALSTORAGE_KEY, response.accessToken);
      qc.invalidateQueries({ queryKey: [CacheKey.USER_PROFILE] });
    },
  }));
};

/**
 * Hook for signing out a user.
 */
export const useSignOutMutation = () => {
  const qc = useQueryClient();

  return createMutation(() => ({
    mutationFn: async () => axios.post('/api/v1/auth/sign-out'),
    onSuccess: () => {
      localStorage.removeItem(ACCESS_TOKEN_LOCALSTORAGE_KEY);
      qc.invalidateQueries({ queryKey: [CacheKey.USER_PROFILE] });
    },
  }));
};
