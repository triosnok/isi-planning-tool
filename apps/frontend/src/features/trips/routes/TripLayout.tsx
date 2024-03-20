import Header from '@/components/layout/Header';
import MapRailingLayer from '@/components/map/MapRailingLayer';
import MapRoot from '@/components/map/MapRoot';
import { LayoutProps } from '@/lib/utils';
import { Component } from 'solid-js';
import { useParams } from '@solidjs/router';
import { useProjectRailings } from '../../projects/api';

const TripLayout: Component<LayoutProps> = (props) => {
  const params = useParams();
  //const railings = useProjectRailings(params.id);

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <main class='flex flex-1'>
        <MapRoot class='relative h-full w-full' customZoom>
          {/* <MapRailingLayer railings={railings.data} /> */}
          {props.children}
        </MapRoot>
      </main>
    </div>
  );
};

export default TripLayout;
