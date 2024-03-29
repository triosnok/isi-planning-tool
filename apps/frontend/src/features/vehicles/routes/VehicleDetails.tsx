import Header from '@/components/layout/Header';
import { A, useParams } from '@solidjs/router';
import { IconChevronLeft } from '@tabler/icons-solidjs';
import { Component, Show } from 'solid-js';
import {
  VehicleSchemaValues,
  useVehicleDetailsQuery,
  useVehicleMutation,
} from '../api';
import VehicleForm from '../components/VehicleForm';
import BackLink from '@/components/navigation/BackLink';

const VehicleDetails: Component = () => {
  const r = useParams();
  const vehicle = useVehicleDetailsQuery(r.id);
  const { update } = useVehicleMutation();

  const handleUpdateVehicle = async (vehicle: VehicleSchemaValues) => {
    try {
      await update.mutateAsync({
        vehicleId: r.id,
        ...vehicle,
      });
    } catch (error) {
      console.error('Failed to update vehicle');
    }
  };

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <div class='flex flex-1'>
        <main class='flex-1 px-6 pb-4 pt-2'>
          <BackLink />

          <h1 class='flex items-center gap-1 text-4xl font-bold'>
            {vehicle.data?.model}
          </h1>

          <Show when={vehicle.data}>
            <VehicleForm
              onSubmit={handleUpdateVehicle}
              vehicleId={vehicle.data?.id}
              camera={vehicle.data?.camera}
              description={vehicle.data?.description}
              gnssId={vehicle.data?.gnssId}
              model={vehicle.data?.model}
              registrationNumber={vehicle.data?.registrationNumber}
            />
          </Show>
        </main>
      </div>
    </div>
  );
};

export default VehicleDetails;
