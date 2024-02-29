import Header from '@/components/layout/Header';
import MapRoot from '@/components/map/MapRoot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/features/i18n';
import { LayoutProps } from '@/lib/utils';
import { useNavigate } from '@solidjs/router';
import { Component, For } from 'solid-js';
import VehicleCard from '../components/VehicleCard';

const VehicleOverview: Component<LayoutProps> = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const handleAddVehicle = () => navigate('/vehicles/new');

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <div class='flex flex-1'>
        <main class='flex-1 px-6 py-4'>
          <h1 class='text-4xl font-bold'>Vehicles</h1>

          <section class='flex items-center gap-2'>
            <Input placeholder='Search...' class='w-fit' />
            <Button onClick={handleAddVehicle} class='ml-auto'>
              {t('VEHICLES.ADD_VEHICLE')}
            </Button>
          </section>

          <section class='mt-2 grid grid-cols-6 gap-2'>
            <For each={Array(10)}>
              {(_i) => (
                <VehicleCard
                  imageUrl='https://picsum.photos/300/200'
                  name='Toyota Corolla'
                  registrationNumber='UN 373281'
                  camera
                  gnssId='123456'
                />
              )}
            </For>
          </section>
        </main>

        <aside class='w-1/3'>
          <MapRoot class='h-full w-full' />
        </aside>

        {props.children}
      </div>
    </div>
  );
};

export default VehicleOverview;
