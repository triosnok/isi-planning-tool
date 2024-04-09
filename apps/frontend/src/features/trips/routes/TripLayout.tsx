import Header from '@/components/layout/Header';
import MapRoot from '@/components/map/MapRoot';
import { LayoutProps } from '@/lib/utils';
import { Component } from 'solid-js';

const TripLayout: Component<LayoutProps> = (props) => {
  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <main class='flex flex-1'>
        <MapRoot class='relative h-full w-full' customZoom>
          {props.children}
        </MapRoot>
      </main>
    </div>
  );
};

export default TripLayout;
