import Header from '@/components/layout/Header';
import MapRailingLayer from '@/components/map/MapRailingLayer';
import MapRoot from '@/components/map/MapRoot';
import MapZoomControls from '@/components/map/MapZoomControls';
import { LayoutProps } from '@/lib/utils';
import { useParams } from '@solidjs/router';
import { Component, createMemo, createSignal } from 'solid-js';
import { useProjectRailings } from '../api';
import { useSelectedPlans } from '../utils';

const ProjectsLayout: Component<LayoutProps> = (props) => {
  const params = useParams();
  const projectId = createMemo(() => {
    return params.id;
  }, params.id);

  const [hideCompletedRailings, setHideCompletedRailings] = createSignal(false);

  const [selectedPlans] = useSelectedPlans();
  const railings = useProjectRailings(
    projectId,
    selectedPlans,
    hideCompletedRailings
  );

  return (
    <div class='flex h-svh w-svw flex-col overflow-hidden'>
      <Header />

      <main class='flex flex-1 overflow-hidden'>
        <aside class='w-full flex-shrink-0 overflow-hidden md:w-96'>
          {props.children}
        </aside>

        <div class='flex-1'>
          <MapRoot class='relative h-full w-full' customZoom>
            <MapZoomControls class='absolute right-2 top-2' />
            <MapRailingLayer railings={railings.data} />
          </MapRoot>
        </div>
      </main>
    </div>
  );
};

export default ProjectsLayout;
