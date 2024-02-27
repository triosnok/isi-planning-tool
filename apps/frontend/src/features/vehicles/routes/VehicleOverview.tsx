import Header from '@/components/layout/Header';
import MapRoot from '@/components/map/MapRoot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutProps } from '@/lib/utils';
import { Component, For } from 'solid-js';
import VehicleCard from '../components/VehicleCard';

const VehicleOverview: Component<LayoutProps> = (props) => {
  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <div class='flex flex-1'>
        <main class='flex-1 px-6 py-4'>
          <h1 class='text-4xl font-bold'>Vehicles</h1>

          <section class='flex items-center gap-2'>
            <Input placeholder='Search...' class='w-fit' />
            <Button class='ml-auto'>Add vehicle</Button>
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
