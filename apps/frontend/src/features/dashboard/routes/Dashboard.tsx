import Header from '@/components/layout/Header';
import MapRoot from '@/components/map/MapRoot';
import { PieChart } from '@/components/ui/charts';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/features/auth/api';
import { DateFormat, useTranslations } from '@/features/i18n';
import TripCard from '@/features/trips/components/TripCard';
import { useTripsByUserQuery } from '@/features/users/api';
import { A } from '@solidjs/router';
import { Component, For } from 'solid-js';

const Dashboard: Component = () => {
  const { t, d, n } = useTranslations();

  const deviationChartData = {
    labels: ['Loose bolt', 'Dent', 'Other'],
    datasets: [
      {
        data: [6, 11, 1],
      },
    ],
  };

  const profile = useProfile();
  const activeTrips = useTripsByUserQuery(() => profile.data?.id, true);

  return (
    <>
      <Header />
      <main class='flex flex-col gap-2 px-32 py-2'>
        <div class='flex flex-col'>
          <p class='self-center text-xl'>Plan X: 133/189 m captured</p>
          <Progress class='rounded-lg' value={80} />
        </div>
        <div>
          <div class='grid grid-cols-2 grid-rows-2 gap-4'>
            <section class='flex flex-col gap-2'>
              <h2 class='text-2xl font-bold'>Map</h2>
              <MapRoot class='h-full'></MapRoot>
            </section>

            <section class='flex flex-col gap-2'>
              <h2 class='text-2xl font-bold'>Active trips</h2>
              <For each={activeTrips.data}>
                {(trip) => (
                  <A href={`/projects/${trip.projectId}/trip/${trip.id}`}>
                    <TripCard
                      sequenceNumber={trip.sequenceNumber}
                      startedAt={d(trip.startedAt, DateFormat.MONTH_DAY)}
                      endedAt={d(trip.endedAt, DateFormat.MONTH_DAY)}
                      deviations={trip.deviations}
                      notes={trip.noteCount}
                      length={320}
                      car={trip.driver}
                    />
                  </A>
                )}
              </For>
            </section>

            <section class='flex flex-col gap-2'>
              <h2 class='text-2xl font-bold'>Deviations</h2>
              <div class='h-5/6 rounded-lg border border-gray-500 p-2'>
                <PieChart data={deviationChartData} />
              </div>
            </section>

            <section class='flex flex-col gap-2'>
              <h2 class='text-2xl font-bold'>Something else</h2>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
