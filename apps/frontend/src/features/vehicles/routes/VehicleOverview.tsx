import Header from '@/components/layout/Header';
import Resizable from '@/components/layout/Resizable';
import MapContainer from '@/components/map/MapContainer';
import MapRoot from '@/components/map/MapRoot';
import MapTripPopoverMarker from '@/components/map/MapTripPopoverMarker';
import MapVehicleMarker from '@/components/map/MapVehicleMarker';
import MapZoomControls from '@/components/map/MapZoomControls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/features/i18n';
import { usePositions } from '@/features/positions';
import { usePanelSizes } from '@/lib/usePanelSizes';
import { LayoutProps } from '@/lib/utils';
import { useNavigate } from '@solidjs/router';
import { Component, For, Index } from 'solid-js';
import { useVehiclesQuery } from '../api';
import VehicleCard from '../components/VehicleCard';

const VehicleOverview: Component<LayoutProps> = (props) => {
  const vehicles = useVehiclesQuery();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const handleAddVehicle = () => navigate('/vehicles/new');
  const { positions } = usePositions('VEHICLE');

  const [panelSizes, setPanelSizes] = usePanelSizes({
    storageKey: 'vehicle-overview-panel-sizes',
    count: 2,
  });

  return (
    <div class='flex h-svh w-svw flex-col overflow-hidden'>
      <Header />

      <Resizable.Root
        class='isolate flex flex-1 overflow-hidden'
        sizes={panelSizes()}
        onSizesChange={setPanelSizes}
      >
        <Resizable.Panel
          as='main'
          class='overflow-y-auto px-6 py-4 max-md:flex-1'
          initialSize={0.7}
          minSize={0.265}
        >
          <section class='flex flex-col justify-between gap-2 sm:flex-row'>
            <h1 class='text-4xl font-bold'>Vehicles</h1>

            <Button onClick={handleAddVehicle} class='ml-auto w-full sm:w-auto'>
              {t('VEHICLES.ADD_VEHICLE')}
            </Button>
          </section>

          <section class='mt-2 grid grid-cols-[repeat(auto-fill,_minmax(12rem,_1fr))] gap-2'>
            <For each={vehicles.data}>
              {(vehicle) => (
                <VehicleCard
                  imageUrl={vehicle.imageUrl}
                  name={vehicle.model}
                  registrationNumber={vehicle.registrationNumber}
                  camera={vehicle.camera}
                  gnssId={vehicle.gnssId}
                  available={vehicle.available}
                  onDetailsClick={() => navigate(`/vehicles/${vehicle.id}`)}
                />
              )}
            </For>
          </section>
        </Resizable.Panel>

        <Resizable.Handle />

        <MapRoot>
          <Resizable.Panel
            as='aside'
            class='max-md:hidden'
            initialSize={0.3}
            minSize={0.2}
          >
            <MapContainer class='relative h-full w-full'>
              <MapZoomControls class='absolute right-2 top-2' />
            </MapContainer>

            <Index each={positions()}>
              {(pos) => (
                <MapTripPopoverMarker
                  as={MapVehicleMarker}
                  position={pos().geometry}
                  heading={pos().heading}
                  tripId={pos().tripId}
                />
              )}
            </Index>
          </Resizable.Panel>
        </MapRoot>
      </Resizable.Root>

      {props.children}
    </div>
  );
};

export default VehicleOverview;
