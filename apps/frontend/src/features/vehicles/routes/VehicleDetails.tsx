import Header from '@/components/layout/Header';
import Resizable from '@/components/layout/Resizable';
import MapContainer from '@/components/map/MapContainer';
import MapRoot from '@/components/map/MapRoot';
import MapTripPopoverMarker from '@/components/map/MapTripPopoverMarker';
import MapVehicleMarker from '@/components/map/MapVehicleMarker';
import MapZoomControls from '@/components/map/MapZoomControls';
import BackLink from '@/components/navigation/BackLink';
import { useSubjectPosition } from '@/features/positions';
import TripTable from '@/features/trips/components/TripTable';
import { usePanelSizes } from '@/lib/usePanelSizes';
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
  const vehicleMutation = useVehicleMutation();
  const trips = useTripsByVehicleQuery(params.id);
  const { position } = useSubjectPosition('VEHICLE', () => params.id);
  const [panelSizes, setPanelSizes] = usePanelSizes({
    storageKey: 'vehicle-details-panel-sizes',
    count: 2,
  });

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

      <Resizable.Root
        class='flex flex-1 overflow-hidden'
        sizes={panelSizes()}
        onSizesChange={setPanelSizes}
      >
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
              imageUrl={vehicle.data?.imageUrl}
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

        <MapRoot>
          <Resizable.Panel as='aside' minSize={0.2} class='w-0 md:w-1/3'>
            <MapContainer class='relative h-full w-full'>
              <MapZoomControls class='absolute right-2 top-2' />
            </MapContainer>

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
          </Resizable.Panel>
        </MapRoot>
      </Resizable.Root>
    </div>
  );
};

export default VehicleDetails;
