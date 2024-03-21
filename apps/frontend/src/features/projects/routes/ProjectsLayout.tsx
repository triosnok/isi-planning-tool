import Header from '@/components/layout/Header';
import MapRailingLayer from '@/components/map/MapRailingLayer';
import MapRoot from '@/components/map/MapRoot';
import { LayoutProps } from '@/lib/utils';
import { useParams } from '@solidjs/router';
import { Component, createMemo } from 'solid-js';
import { useProjectRailings } from '../api';
import MapZoomControls from '@/components/map/MapZoomControls';

const ProjectsLayout: Component<LayoutProps> = (props) => {
  const params = useParams();
  const projectId = createMemo(() => {
    return params.id;
  }, params.id);

  const railings = useProjectRailings(projectId);

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <main class='flex flex-1'>
        <aside class='w-full md:w-96 flex-shrink-0'>{props.children}</aside>

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
