import { CacheKey } from '@/api';
import {
  CreateVehicleRequest,
  TripDetails,
  VehicleDetails,
} from '@isi-insight/client';
import {
  createMutation,
  createQuery,
  useQueryClient,
} from '@tanstack/solid-query';
import axios from 'axios';
import { Accessor } from 'solid-js';
import { z } from 'zod';

export const useVehiclesQuery = (
  availableFrom?: Accessor<string | undefined>,
  availableTo?: Accessor<string | undefined>
) => {
  return createQuery(() => ({
    queryKey: [CacheKey.VEHICLE_LIST, availableFrom?.(), availableTo?.()],
    queryFn: async ({ queryKey }) => {
      const [_, availableFrom, availableTo] = queryKey;

      const params = new URLSearchParams();

      if (availableFrom !== undefined)
        params.set('availableFrom', availableFrom);
      if (availableTo !== undefined) params.set('availableTo', availableTo);

      const response = await axios.get<VehicleDetails[]>(
        `/api/v1/vehicles?${params.toString()}`
      );

      return response.data;
    },
  }));
};

export const useTripsByVehicleQuery = (vehicleId: string) => {
  return createQuery(() => ({
    queryKey: [CacheKey.TRIP_LIST, vehicleId],
    queryFn: async () => {
      const response = await axios.get<TripDetails[]>(
        `/api/v1/vehicles/${vehicleId}/trips`
      );

      return response.data;
    },
  }));
};

export const useVehicleDetailsQuery = (id: string) => {
  return createQuery(() => ({
    queryKey: [CacheKey.VEHICLE_DETAILS, id],
    queryFn: async () => {
      if (id === undefined) return null;

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
  model: z.string().min(1),
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
