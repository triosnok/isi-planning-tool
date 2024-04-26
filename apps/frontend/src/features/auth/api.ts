import { CacheKey } from '@/api';
import type {
  ForgotPasswordRequest,
  GetConfirmationCodeRequest,
  ResetPasswordRequest,
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
    queryKey: [CacheKey.USER_PROFILE],
    staleTime: Infinity,
    queryFn: async () => {
      try {
        const response = await axios.get<UserProfile>('/api/v1/auth/profile');
        return response.data;
      } catch (error) {
        return null;
      }
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
    onSuccess: () => {
      qc.refetchQueries({ queryKey: [CacheKey.USER_PROFILE] });
    },
  }));
};

/**
 * Hook for refreshing the access token.
 */
export const useRefreshTokenQuery = () => {
  const qc = useQueryClient();

  return createQuery(() => ({
    queryKey: [],
    refetchIntervalInBackground: true,
    refetchInterval: 1000 * 60 * 4,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await axios.get<SignInResponse>('/api/v1/auth/refresh');
      return response.data;
    },
    onSuccess: () => {
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
    mutationFn: async () => await axios.post('/api/v1/auth/sign-out'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CacheKey.USER_PROFILE] });
    },
  }));
};

export const useForgotPasswordMutation = () => {
  const sendCode = createMutation(() => ({
    mutationFn: async (request: ForgotPasswordRequest) =>
      axios.post('/api/v1/auth/forgot-password', request),
  }));

  const confirmCode = createMutation(() => ({
    mutationFn: async (request: GetConfirmationCodeRequest) => {
      const response = await axios.post<string>(
        '/api/v1/auth/reset-password/code',
        request
      );

      return response.data;
    },
  }));

  const resetPassword = createMutation(() => ({
    mutationFn: async (request: ResetPasswordRequest) =>
      axios.post('/api/v1/auth/reset-password', request),
  }));

  return { sendCode, confirmCode, resetPassword };
};
