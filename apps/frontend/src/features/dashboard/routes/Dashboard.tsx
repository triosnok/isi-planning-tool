import Header from '@/components/layout/Header';
import MapRailingLayer from '@/components/map/MapRailingLayer';
import MapRoot from '@/components/map/MapRoot';
import { Component } from 'solid-js';

const Dashboard: Component = () => {
  return (
    <>
      <Header />
      <main class='flex justify-center'>
        <div class=''>
          <h2>Coverage</h2>
          <MapRoot class='h-96 w-96'>
            <MapRailingLayer></MapRailingLayer>
          </MapRoot>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
