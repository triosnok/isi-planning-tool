import Header from '@/components/layout/Header';
import MapVehicleMarker from '@/components/map/MapVehicleMarker';
import MapRoot from '@/components/map/MapRoot';
import BackLink from '@/components/navigation/BackLink';
import { useSubjectPosition } from '@/features/positions';
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
import Resizable from '@/components/layout/Resizable';
import MapZoomControls from '@/components/map/MapZoomControls';
import MapTripPopoverMarker from '@/components/map/MapTripPopoverMarker';

const VehicleDetails: Component = () => {
  const params = useParams();
  const vehicle = useVehicleDetailsQuery(params.id);
  const vehicleMutation = useVehicleMutation();
  const trips = useTripsByVehicleQuery(params.id);
  const { position } = useSubjectPosition('VEHICLE', () => params.id);

  const handleUpdateVehicle = async (vehicle: VehicleSchemaValues) => {
    try {
      await vehicleMutation.update.mutateAsync({
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

      <Resizable.Root class='flex flex-1 overflow-hidden'>
        <Resizable.Panel
          initialSize={0.6}
          minSize={0.5}
          class='flex-1 overflow-y-auto p-2 py-2'
        > 
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
              isError={vehicleMutation.update.isError}
              registrationNumber={vehicle.data?.registrationNumber}
            />
          </Show>

          <Show when={trips?.data}>
            <TripTable trips={trips.data ?? []} driver={true} />
          </Show>
        </Resizable.Panel>

        <Resizable.Handle />

        <Resizable.Panel as='aside' minSize={0.2} class='w-0 md:w-1/3'>
          <MapRoot class='relative h-full w-full'>
            <MapZoomControls class='absolute right-2 top-2' />

            <Show when={position()}>
              {(pos) => (
                <MapTripPopoverMarker
                  as={MapVehicleMarker}
                  position={pos().geometry}
                  heading={pos().heading}
                  tripId={pos().tripId}
                />
              )}
            </Show>
          </MapRoot>
        </Resizable.Panel>
      </Resizable.Root>
    </div>
  );
};

export default VehicleDetails;
