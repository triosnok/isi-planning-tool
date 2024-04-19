import { CacheKey } from '@/api';
import {
  CreateUserAccountRequest,
  TripDetails,
  UserAccountDetails,
} from '@isi-insight/client';
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import axios from 'axios';
import { z } from 'zod';

export const useUsersQuery = () => {
  return createQuery(() => ({
    queryKey: [CacheKey.USER_LIST],
    queryFn: async ({ queryKey }) => {
      const params = new URLSearchParams();
      const response = await axios.get<UserAccountDetails[]>(
        `/api/v1/user-accounts?${params.toString()}`
      );

      return response.data;
    },
  }));
};

export const useTripsByUserQuery = (userId: string, active?: boolean) => {
  return createQuery(() => ({
    queryKey: [CacheKey.TRIP_LIST, userId, active] as const,
    queryFn: async ({ queryKey }) => {
      const [_, userId, active] = queryKey;
      const params = new URLSearchParams();

      if (active !== undefined) {
        params.set('active', active.toString());
      }

      const response = await axios.get<TripDetails[]>(
        `/api/v1/user-accounts/${userId}/trips?${params.toString()}`
      );

      return response.data;
    },
  }));
};

export const useUserDetailsQuery = (id: string) => {
  return createQuery(() => ({
    queryKey: [CacheKey.USER_DETAILS, id],
    queryFn: async () => {
      const response = await axios.get<UserAccountDetails>(
        `/api/v1/user-accounts/${id}`
      );

      return response.data;
    },
  }));
};

export const CreateUserSchema = z
  .object({
    userId: z.string().optional(),
    imageUrl: z.string().optional(),
    fullName: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().optional(),
    role: z.enum(['DRIVER', 'PLANNER']),
    password: z.string().min(1, 'Password is required'),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

export type CreateUserSchemaValues = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z
  .object({
    userId: z.string().optional(),
    imageUrl: z.string().optional(),
    fullName: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().optional(),
    role: z.enum(['DRIVER', 'PLANNER']),
    changePassword: z.boolean(),
    password: z.string().min(1, 'Password is required').optional(),
    passwordConfirmation: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

export type UpdateUserSchemaValues = z.infer<typeof UpdateUserSchema>;

export const useUserMutation = () => {
  const qc = useQueryClient();

  const create = createMutation(() => ({
    mutationFn: async (user: CreateUserAccountRequest) => {
      const response = await axios.post<UserAccountDetails>(
        '/api/v1/user-accounts',
        user
      );

      return response.data;
    },
    onSuccess: (_data, _variables, _context) => {
      qc.invalidateQueries({ queryKey: [CacheKey.USER_LIST] });
    },
  }));

  const update = createMutation(() => ({
    mutationFn: async (user: UpdateUserSchemaValues) => {
      const response = await axios.put<UserAccountDetails>(
        `/api/v1/user-accounts/${user.userId}`,
        user
      );

      return response.data;
    },
    onSuccess: (_data, variables, _context) => {
      qc.invalidateQueries({ queryKey: [CacheKey.USER_LIST] });
      qc.invalidateQueries({
        queryKey: [CacheKey.USER_DETAILS, variables.userId],
      });
    },
  }));

  return { create, update };
};
