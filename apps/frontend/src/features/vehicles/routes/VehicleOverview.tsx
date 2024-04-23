import Header from '@/components/layout/Header';
import MapRoot from '@/components/map/MapRoot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/features/i18n';
import { LayoutProps } from '@/lib/utils';
import { useNavigate } from '@solidjs/router';
import { Component, For, Index } from 'solid-js';
import { useVehiclesQuery } from '../api';
import VehicleCard from '../components/VehicleCard';
import { usePositions } from '@/features/positions';
import MapCarLayer from '@/components/map/MapCarLayer';

const VehicleOverview: Component<LayoutProps> = (props) => {
  const vehicles = useVehiclesQuery();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const handleAddVehicle = () => navigate('/vehicles/new');
  const { positions } = usePositions();

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <div class='flex flex-1'>
        <main class='flex-1 px-6 py-4'>
          <h1 class='text-4xl font-bold'>Vehicles</h1>

          <section class='flex flex-col justify-between gap-2 sm:flex-row'>
            <Input placeholder={t('NAVIGATION.SEARCH')} class='w-fit' />
            <Button onClick={handleAddVehicle} class='ml-auto w-full sm:w-auto'>
              {t('VEHICLES.ADD_VEHICLE')}
            </Button>
          </section>

          <section class='mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
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
                  class='min-w-48'
                />
              )}
            </For>
          </section>
        </main>

        <aside class='w-0 md:w-1/3'>
          <MapRoot class='h-full w-full'>
            <Index each={positions()}>
              {(pos) => (
                <MapCarLayer
                  position={pos().geometry}
                  heading={pos().heading}
                />
              )}
            </Index>
          </MapRoot>
        </aside>

        {props.children}
      </div>
    </div>
  );
};

export default VehicleOverview;
