import { CacheKey } from '@/api';
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import axios from 'axios';

export const useVehiclesQuery = () => {
  return createQuery(() => ({
    queryKey: [CacheKey.VEHICLE_LIST],
    queryFn: async () => axios.get<any>('/api/v1/vehicles'),
  }));
};

export const useVehicleDetailsQuery = (id: string) => {
  return createQuery(() => ({
    queryKey: [CacheKey.VEHICLE_DETAILS, id],
    queryFn: async () => axios.get<any>(`/api/v1/vehicles/${id}`),
  }));
};

export const useVehicleMutation = () => {
  const qc = useQueryClient();

  const create = createMutation(() => ({
    mutationFn: async (vehicle: any) =>
      axios.post<any>('/api/v1/vehicles', vehicle),
    onSuccess: (_data, variables, _context) => {
      qc.invalidateQueries({ queryKey: [CacheKey.VEHICLE_LIST] });
      qc.invalidateQueries({
        queryKey: [CacheKey.VEHICLE_DETAILS, variables.id],
      });
    },
  }));

  const update = createMutation(() => ({
    mutationFn: async (vehicle: any) =>
      axios.put<any>(`/api/v1/vehicles/${vehicle.id}`, vehicle),
    onSuccess: (_data, variables, _context) => {
      qc.invalidateQueries({ queryKey: [CacheKey.VEHICLE_LIST] });
      qc.invalidateQueries({
        queryKey: [CacheKey.VEHICLE_DETAILS, variables.id],
      });
    },
  }));

  return { create, update };
};