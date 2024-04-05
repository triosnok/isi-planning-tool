import { CacheKey } from '@/api';
import {
  CreateUserAccountRequest,
  UserAccountDetails,
  UserRole,
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

export const UserSchema = z
  .object({
    userId: z.string().optional(),
    imageUrl: z.string().optional(),
    fullName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    role: z.enum(['DRIVER', 'PLANNER']),
    password: z.string().min(1),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

export type UserSchemaValues = z.infer<typeof UserSchema>;

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
    mutationFn: async (user: UserSchemaValues) => {
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
