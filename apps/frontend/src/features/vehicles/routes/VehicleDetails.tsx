import Header from '@/components/layout/Header';
import MapRoot from '@/components/map/MapRoot';
import BackLink from '@/components/navigation/BackLink';
import { useTranslations } from '@/features/i18n';
import TripTable from '@/features/trips/components/TripTable';
import { useParams } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import {
  VehicleSchemaValues,
  useTripsByVehicleQuery,
  useVehicleDetailsQuery,
  useVehicleMutation,
} from '../api';
import VehicleForm from '../components/VehicleForm';

const VehicleDetails: Component = () => {
  const params = useParams();
  const vehicle = useVehicleDetailsQuery(params.id);
  const { update } = useVehicleMutation();
  const { t } = useTranslations();

  const trips = useTripsByVehicleQuery(params.id);

  const handleUpdateVehicle = async (vehicle: VehicleSchemaValues) => {
    try {
      await update.mutateAsync({
        vehicleId: params.id,
        ...vehicle,
      });
    } catch (error) {
      console.error('Failed to update vehicle');
    }
  };

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <div class='flex flex-1 overflow-hidden'>
        <main class='flex-1 overflow-y-auto p-2 py-2'>
          <BackLink />

          <Show when={vehicle?.data}>
            <h1 class='flex items-center gap-1 pb-2 text-4xl font-bold'>
              {vehicle.data?.model}
            </h1>

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

          <Show when={trips?.data}>
            <TripTable trips={trips.data ?? []} driver={true} />
          </Show>
        </main>

        <aside class='w-0 md:w-1/3'>
          <MapRoot class='h-full w-full' />
        </aside>
      </div>
    </div>
  );
};

export default VehicleDetails;
