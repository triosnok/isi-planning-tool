import Card from '@/components/layout/Card';
import Header from '@/components/layout/Header';
import MapRoot from '@/components/map/MapRoot';
import MapZoomControls from '@/components/map/MapZoomControls';
import { BarChart, PieChart } from '@/components/ui/charts';
import {
  Progress,
  ProgressLabel,
  ProgressValueLabel,
} from '@/components/ui/progress';
import { useProfile } from '@/features/auth/api';
import { useCaptureMetersByDayQuery } from '@/features/capture/api';
import { useDeviationCountsQuery } from '@/features/deviation';
import { DateFormat, NumberFormat, useTranslations } from '@/features/i18n';
import { useProjectsQuery } from '@/features/projects/api';
import TripCard from '@/features/trips/components/TripCard';
import { useTripsByUserQuery } from '@/features/users/api';
import { A } from '@solidjs/router';
import { Component, For } from 'solid-js';

const Dashboard: Component = () => {
  const { t, d, n } = useTranslations();
  const metersPerDay = useCaptureMetersByDayQuery();
  const deviationCounts = useDeviationCountsQuery();

  const deviationChartData = () => {
    const deviationsData = deviationCounts.data;
    const lables = deviationsData?.map((deviation) => deviation.type) ?? [];

    const data = deviationsData?.map((deviation) => deviation.count) ?? [];

    return {
      labels: lables,
      datasets: [
        {
          label: 'Deviations by type',
          data,
        },
      ],
    };
  };

  const metersCapturedData = () => {
    const captureData = metersPerDay.data;
    const labels =
      captureData?.map((meters) => d(meters.date, DateFormat.MONTH_DAY)) ?? [];

    const data = captureData?.map((meters) => meters.meters) ?? [];

    return {
      labels,
      datasets: [
        {
          label: 'Meters captured',
          data,
        },
      ],
    };
  };

  const profile = useProfile();
  const activeTrips = useTripsByUserQuery(() => profile.data?.id, true);
  const ongoingProjects = useProjectsQuery('ONGOING');

  const ongoingProjectsProgress = () => {
    const projects = ongoingProjects.data;
    const aggregate = {
      captured: 0,
      total: 0,
      percentage: 0,
    };

    projects?.forEach(({ capturedLength, totalLength }) => {
      aggregate.captured += capturedLength;
      aggregate.total += totalLength;
    });

    if (aggregate.captured > 0) {
      aggregate.percentage = (aggregate.captured / aggregate.total) * 100;
    }

    return aggregate;
  };

  return (
    <div class='flex h-svh w-svw flex-col overflow-hidden bg-gray-200 dark:bg-gray-950'>
      <Header />

      <div class='mt-2 px-32'>
        <Card class='p-2'>
          <Progress
            class='rounded-lg'
            value={ongoingProjectsProgress().percentage}
          >
            <div class='my-1 flex justify-between'>
              <ProgressLabel>
                {t('DASHBOARD.ACTIVE_PROJECTS_PROGRESS')}
              </ProgressLabel>
              <ProgressValueLabel>
                {n(ongoingProjectsProgress().captured, NumberFormat.INTEGER)} /{' '}
                {n(ongoingProjectsProgress().total, NumberFormat.INTEGER)} m
              </ProgressValueLabel>
            </div>
          </Progress>
        </Card>
      </div>

      <main class='grid flex-1 grid-cols-2 grid-rows-2 gap-2 overflow-hidden px-32 py-2'>
        <Card class='relative'>
          <MapRoot class='h-full w-full overflow-hidden rounded-md'>
            <MapZoomControls class='absolute right-2 top-2' />
          </MapRoot>
        </Card>

        <Card class='px-2 py-1'>
          <CardHeader title={t('TRIPS.ACTIVE_TRIPS')} />

          <div class='flex flex-col gap-2 overflow-y-auto'>
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
                    status='dashboard'
                  />
                </A>
              )}
            </For>
          </div>
        </Card>

        <Card class='flex flex-col px-2 py-1'>
          <CardHeader title={t('DEVIATIONS.TITLE')} />
          <div class='relative flex-1 overflow-hidden'>
            <PieChart
              data={deviationChartData()}
              class='size-full max-h-full max-w-full'
            />
          </div>
        </Card>

        <Card class='flex flex-col px-2 py-1'>
          <CardHeader title={t('DASHBOARD.DAILY_METERS_CAPTURED')} />
          <div class='relative flex-1 overflow-hidden'>
            <BarChart
              data={metersCapturedData()}
              class='max-h-full max-w-full size-full'
            />
          </div>
        </Card>
      </main>
    </div>
  );
};

const CardHeader: Component<{ title?: string }> = (props) => (
  <h2 class='text-xl font-bold'>{props.title}</h2>
);

export default Dashboard;
