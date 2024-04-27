import Header from '@/components/layout/Header';
import MapRailingLayer from '@/components/map/MapRailingLayer';
import MapRoot from '@/components/map/MapRoot';
import MapZoomControls from '@/components/map/MapZoomControls';
import { LayoutProps } from '@/lib/utils';
import { useParams } from '@solidjs/router';
import { Component } from 'solid-js';
import { useProjectRailings } from '../api';
import { useProjectSearchParams } from '../utils';
import MapPopupLayer from '@/components/map/MapPopupLayer';

const ProjectsLayout: Component<LayoutProps> = (props) => {
  const params = useParams();
  const searchParams = useProjectSearchParams();
  const railings = useProjectRailings(
    () => params.id,
    searchParams.selectedPlans,
    searchParams.hideCompleted
  );

  return (
    <div class='flex h-svh w-svw flex-col overflow-hidden'>
      <Header />

      <main class='flex flex-1 overflow-hidden'>
        <aside class='flex w-full flex-shrink-0 flex-col overflow-hidden md:w-96'>
          {props.children}
        </aside>

        <div class='flex-1'>
          <MapRoot class='relative h-full w-full' customZoom>
            <MapZoomControls class='absolute right-2 top-2' />
            <MapRailingLayer railings={railings.data} />
            <MapPopupLayer />
          </MapRoot>
        </div>
      </main>
    </div>
  );
};

export default ProjectsLayout;
