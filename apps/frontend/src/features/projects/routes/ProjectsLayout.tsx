import Header from '@/components/layout/Header';
import MapPopupLayer from '@/components/map/MapPopupLayer';
import MapRailingLayer from '@/components/map/MapRailingLayer';
import MapRoot from '@/components/map/MapRoot';
import MapZoomControls from '@/components/map/MapZoomControls';
import { LayoutProps, cn } from '@/lib/utils';
import { useParams } from '@solidjs/router';
import { Component, createSignal } from 'solid-js';
import { useProjectRailings } from '../api';
import ProjectTabBar from '../components/ProjectTabBar';
import { useProjectSearchParams } from '../utils';

const ProjectsLayout: Component<LayoutProps> = (props) => {
  const params = useParams();
  const searchParams = useProjectSearchParams();
  const railings = useProjectRailings(
    () => params.id,
    searchParams.selectedPlans,
    searchParams.hideCompleted
  );

  const [showMobileMap, setShowMobileMap] = createSignal(false);

  return (
    <div class='flex h-svh w-svw flex-col overflow-hidden'>
      <Header />

      <main class='flex flex-1 overflow-hidden'>
        <aside
          class={cn(
            'flex w-full flex-shrink-0 flex-col overflow-hidden md:w-96',
            showMobileMap() && 'max-md:hidden'
          )}
        >
          {props.children}
        </aside>

        <div
          class={cn(
            'flex-1',
            showMobileMap() ? 'max-md:flex' : 'max-md:hidden'
          )}
        >
          <MapRoot class='relative h-full w-full' customZoom>
            <MapZoomControls class='absolute right-2 top-2' />
            <MapRailingLayer railings={railings.data} />
            <MapPopupLayer />
          </MapRoot>
        </div>
      </main>

      <div class='md:hidden'>
        <ProjectTabBar
          tabs={{
            map: {
              isActive: showMobileMap(),
              onPress: () => setShowMobileMap(true),
            },
            project: {
              isActive: !showMobileMap(),
              onPress: () => setShowMobileMap(false),
            },
          }}
        />
      </div>
    </div>
  );
};

export default ProjectsLayout;
