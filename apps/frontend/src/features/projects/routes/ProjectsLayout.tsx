import Header from '@/components/layout/Header';
import MapRailingLayer from '@/components/map/MapRailingLayer';
import MapRoot from '@/components/map/MapRoot';
import { LayoutProps } from '@/lib/utils';
import { Component } from 'solid-js';

const ProjectsLayout: Component<LayoutProps> = (props) => {
  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <main class='flex flex-1'>
        <aside class='w-96 flex-shrink-0'>{props.children}</aside>

        <div class='flex-1'>
          <MapRoot class='h-full w-full'>
            <MapRailingLayer />
          </MapRoot>
        </div>
      </main>
    </div>
  );
};

export default ProjectsLayout;
