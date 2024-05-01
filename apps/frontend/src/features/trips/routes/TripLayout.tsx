import Header from '@/components/layout/Header';
import MapFollowVehicleToggle from '@/components/map/MapFollowVehicleToggle';
import MapPopupLayer from '@/components/map/MapPopupLayer';
import MapRoot from '@/components/map/MapRoot';
import MapZoomControls from '@/components/map/MapZoomControls';
import { LayoutProps } from '@/lib/utils';
import { Component } from 'solid-js';

const TripLayout: Component<LayoutProps> = (props) => {
  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <main class='flex flex-1'>
        <MapRoot class='relative h-full w-full' customZoom follow={false}>
          {props.children}
          <MapPopupLayer />
          <div class='absolute right-2 top-2 flex flex-col gap-2'>
            <MapZoomControls />
            <MapFollowVehicleToggle />
          </div>
        </MapRoot>
      </main>
    </div>
  );
};

export default TripLayout;
