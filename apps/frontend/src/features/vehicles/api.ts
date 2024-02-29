import { CacheKey } from '@/api';
import { CreateVehicleRequest, VehicleDetails } from '@isi-insight/client';
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import axios from 'axios';
import { z } from 'zod';

export const useVehiclesQuery = () => {
  return createQuery(() => ({
    queryKey: [CacheKey.VEHICLE_LIST],
    queryFn: async () => {
      const response = await axios.get<VehicleDetails[]>('/api/v1/vehicles');

      return response.data;
    },
  }));
};

export const useVehicleDetailsQuery = (id: string) => {
  return createQuery(() => ({
    queryKey: [CacheKey.VEHICLE_DETAILS, id],
    queryFn: async () => {
      const response = await axios.get<VehicleDetails>(
        `/api/v1/vehicles/${id}`
      );

      return response.data;
    },
  }));
};

export const VehicleSchema = z.object({
  vehicleId: z.string().optional(),
  imageUrl: z.string().optional(),
  registrationNumber: z.string().min(1),
  camera: z.boolean(),
  model: z.string(),
  description: z.string(),
  gnssId: z.string(),
});

export type VehicleSchemaValues = z.infer<typeof VehicleSchema>;

export const useVehicleMutation = () => {
  const qc = useQueryClient();

  const create = createMutation(() => ({
    mutationFn: async (vehicle: CreateVehicleRequest) => {
      const response = await axios.post<VehicleDetails>(
        '/api/v1/vehicles',
        vehicle
      );

      return response.data;
    },
    onSuccess: (_data, _variables, _context) => {
      qc.invalidateQueries({ queryKey: [CacheKey.VEHICLE_LIST] });
    },
  }));

  const update = createMutation(() => ({
    mutationFn: async (vehicle: VehicleSchemaValues) => {
      const response = await axios.put<VehicleDetails>(
        `/api/v1/vehicles/${vehicle.vehicleId}`,
        vehicle
      );

      return response.data;
    },
    onSuccess: (_data, variables, _context) => {
      qc.invalidateQueries({ queryKey: [CacheKey.VEHICLE_LIST] });
      qc.invalidateQueries({
        queryKey: [CacheKey.VEHICLE_DETAILS, variables.vehicleId],
      });
    },
  }));

  return { create, update };
};
