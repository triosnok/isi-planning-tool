import Header from '@/components/layout/Header';
import Resizable from '@/components/layout/Resizable';
import MapCarLayer from '@/components/map/MapCarLayer';
import MapRoot from '@/components/map/MapRoot';
import MapZoomControls from '@/components/map/MapZoomControls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/features/i18n';
import { usePositions } from '@/features/positions';
import { LayoutProps } from '@/lib/utils';
import { useNavigate } from '@solidjs/router';
import { Component, For, Index, Show } from 'solid-js';
import { useVehiclesQuery } from '../api';
import VehicleCard from '../components/VehicleCard';

const VehicleOverview: Component<LayoutProps> = (props) => {
  const vehicles = useVehiclesQuery();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const handleAddVehicle = () => navigate('/vehicles/new');
  const { positions } = usePositions('VEHICLE');

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <div class='flex flex-1'>
        <Resizable.Root class='isolate flex flex-1'>
          <Resizable.Panel
            as='main'
            class='px-6 py-4'
            initialSize={0.7}
            minSize={0.265}
          >
            <h1 class='text-4xl font-bold'>Vehicles</h1>

            <section class='flex flex-col justify-between gap-2 sm:flex-row'>
              <Input placeholder={t('NAVIGATION.SEARCH')} class='w-fit' />
              <Button
                onClick={handleAddVehicle}
                class='ml-auto w-full sm:w-auto'
              >
                {t('VEHICLES.ADD_VEHICLE')}
              </Button>
            </section>

            <section class='mt-2 flex flex-wrap gap-2'>
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
                    class='w-56'
                  />
                )}
              </For>
            </section>
          </Resizable.Panel>

          <Resizable.Handle />

          <Resizable.Panel
            as='aside'
            class='max-md:hidden'
            initialSize={0.3}
            minSize={0.2}
          >
            {(panel) => (
              <Show when={!panel.collapsed}>
                <MapRoot class='relative h-full w-full'>
                  <MapZoomControls class='absolute right-2 top-2' />
                  <Index each={positions()}>
                    {(pos) => (
                      <MapCarLayer
                        position={pos().geometry}
                        heading={pos().heading}
                      />
                    )}
                  </Index>
                </MapRoot>
              </Show>
            )}
          </Resizable.Panel>
        </Resizable.Root>

        {props.children}
      </div>
    </div>
  );
};

export default VehicleOverview;
