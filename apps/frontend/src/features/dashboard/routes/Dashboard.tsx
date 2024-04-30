import Header from '@/components/layout/Header';
import MapRoot from '@/components/map/MapRoot';
import { BarChart, PieChart } from '@/components/ui/charts';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/features/auth/api';
import { useCaptureMetersByDayQuery } from '@/features/capture/api';
import { useDeviationCountsQuery } from '@/features/deviation';
import { DateFormat, useTranslations } from '@/features/i18n';
import { useProjectsQuery } from '@/features/projects/api';
import TripCard from '@/features/trips/components/TripCard';
import { useTripsByUserQuery } from '@/features/users/api';
import { A } from '@solidjs/router';
import { Component, For, createSignal } from 'solid-js';
import TagCard from '../components/TagCard';

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
  const ongoingProjectIds = () =>
    ongoingProjects.data?.map((project) => project.id) || [];

  const [selectedProjectTags, setSelectedProjectTags] =
    createSignal<string[]>(ongoingProjectIds());

  const handleProjectTagToggled = (projectId: string) => {
    const projects = selectedProjectTags();

    if (projects.includes(projectId)) {
      setSelectedProjectTags((p) => p.filter((id) => id !== projectId));
    } else {
      setSelectedProjectTags([...projects, projectId]);
    }
  };

  return (
    <>
      <Header />
      <main class='mb-4 flex flex-col gap-2 px-32 py-2'>
        <div class='flex flex-col'>
          <p class='self-center text-xl'>
            Active projects progress: 133 / 189 m captured
          </p>
          <Progress class='rounded-lg' value={80} />
        </div>
        <div>
          <div class='grid grid-cols-2 grid-rows-2 gap-4'>
            <section class='flex flex-col gap-2'>
              <h2 class='text-2xl font-bold'>{t('MAP.TITLE')}</h2>
              <MapRoot class='h-full overflow-hidden rounded-lg' />
            </section>

            <section class='flex flex-col gap-2'>
              <h2 class='text-2xl font-bold'>{t('TRIPS.ACTIVE_TRIPS')}</h2>
              <div class='flex flex-col gap-2 overflow-scroll'>
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
            </section>

            <section class='flex flex-col gap-2'>
              <h2 class='text-2xl font-bold'>{t('DEVIATIONS.TITLE')}</h2>
              <div class='h-5/6 rounded-lg border border-gray-500 p-2'>
                <PieChart data={deviationChartData()} />
              </div>
            </section>

            <section class='flex flex-col gap-2'>
              <h2 class='text-2xl font-bold'>
                {t('DASHBOARD.DAILY_METERS_CAPTURED')}
              </h2>
              <div class='h-5/6 rounded-lg border border-gray-500 p-2'>
                <BarChart data={metersCapturedData()} />
              </div>
              <div class='flex gap-2 truncate'>
                <For each={ongoingProjects.data}>
                  {(project) => (
                    <TagCard
                      tag={project.name}
                      selected={selectedProjectTags().includes(project.id)}
                      onToggle={() => handleProjectTagToggled(project.id)}
                    />
                  )}
                </For>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
