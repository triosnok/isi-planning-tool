import Header from '@/components/layout/Header';
import MapRoot from '@/components/map/MapRoot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/features/i18n';
import { LayoutProps } from '@/lib/utils';
import { useNavigate } from '@solidjs/router';
import { Component, For } from 'solid-js';
import { useVehiclesQuery } from '../api';
import VehicleCard from '../components/VehicleCard';
import VehicleSelect from '../components/VehicleSelect';
import DatePicker from '@/components/temporal/DatePicker';

const VehicleOverview: Component<LayoutProps> = (props) => {
  const vehicles = useVehiclesQuery();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const handleAddVehicle = () => navigate('/vehicles/new');

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <div class='flex flex-1'>
        <main class='flex-1 px-6 py-4'>
          <h1 class='text-4xl font-bold'>Vehicles</h1>

          <section class='flex justify-between gap-2 flex-col sm:flex-row'>
            <Input placeholder='Search...' class='w-fit' />
            <Button onClick={handleAddVehicle} class='ml-auto w-full sm:w-auto'>
              {t('VEHICLES.ADD_VEHICLE')}
            </Button>
          </section>

          <section class='mt-2 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2'>
            <For each={vehicles.data}>
              {(vehicle) => (
                <VehicleCard
                  imageUrl={vehicle.imageUrl}
                  name={vehicle.model}
                  registrationNumber={vehicle.registrationNumber}
                  camera={vehicle.camera}
                  gnssId={vehicle.gnssId}
                  onDetailsClick={() => navigate(`/vehicles/${vehicle.id}`)}
                  class='min-w-48'
                />
              )}
            </For>
          </section>
        </main>

        <aside class='w-0 md:w-1/3'>
          <MapRoot class='h-full w-full' />
        </aside>

        {props.children}
      </div>
    </div>
  );
};

export default VehicleOverview;
