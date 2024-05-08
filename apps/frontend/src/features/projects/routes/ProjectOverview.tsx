import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/features/auth/api';
import { DateFormat, useTranslations } from '@/features/i18n';
import ProjectCard from '@/features/projects/components/ProjectCard';
import { useVehiclesQuery } from '@/features/vehicles/api';
import VehicleSelect from '@/features/vehicles/components/VehicleSelect';
import { vehiclePreference } from '@/features/vehicles/context';
import { VehicleDetails } from '@isi-insight/client';
import { A } from '@solidjs/router';
import { IconPlus } from '@tabler/icons-solidjs';
import { Component, For, Show } from 'solid-js';
import { useProjectsQuery } from '../api';

const ProjectOverview: Component = () => {
  const ongoingProjects = useProjectsQuery('ONGOING');
  const upcomingProjects = useProjectsQuery('UPCOMING');
  const previousProjects = useProjectsQuery('PREVIOUS');
  const { t, d } = useTranslations();
  const profile = useProfile();
  const vehicles = useVehiclesQuery();
  const { selectedVehicle, setSelectedVehicle } = vehiclePreference();

  const handleChange = (value?: VehicleDetails) => {
    setSelectedVehicle(value);
  };

  return (
    <>
      <div class='flex flex-col gap-2 overflow-y-auto p-2'>
        <div class='flex items-center justify-between'>
          <h1 class='text-4xl font-bold'>{t('PROJECTS.TITLE')}</h1>
          <Show when={profile.data?.role == 'PLANNER'}>
            <A href='/projects/new'>
              <Button>
                <IconPlus />
              </Button>
            </A>
          </Show>
        </div>

        <div>
          <p class='ml-1 font-semibold'>{t('VEHICLES.PREFERED_VEHICLE')}</p>
          <VehicleSelect
            vehicles={vehicles.data ?? []}
            value={selectedVehicle()}
            onChange={handleChange}
            emptyText={t('VEHICLES.NO_VEHICLE_SELECTED')}
          />
        </div>
        <Input placeholder={t('NAVIGATION.SEARCH')} />
      </div>

      <Accordion multiple={true} defaultValue={['ongoing', 'upcoming']} class='flex-1 overflow-y-auto'>
        <AccordionItem value='ongoing'>
          <AccordionTrigger>
            {t('PROJECTS.STATUS.ONGOING')} ({ongoingProjects.data?.length})
          </AccordionTrigger>
          <AccordionContent class='flex flex-col space-y-2 p-2'>
            <For each={ongoingProjects.data}>
              {(project) => (
                <A href={`/projects/${project.id}`}>
                  <ProjectCard
                    name={project.name}
                    referenceCode={project.referenceCode}
                    startsAt={d(project.startsAt, DateFormat.MONTH_DAY)}
                    endsAt={d(project.endsAt, DateFormat.MONTH_DAY)}
                    status={project.status}
                    capturedLength={project.capturedLength}
                    totalLength={project.totalLength}
                    notes={project.notes}
                    deviations={project.deviations}
                    progress={project.progress}
                  />
                </A>
              )}
            </For>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='upcoming'>
          <AccordionTrigger>
            {t('PROJECTS.STATUS.UPCOMING')} ({upcomingProjects.data?.length})
          </AccordionTrigger>
          <AccordionContent class='flex flex-col space-y-2 p-2'>
            <For each={upcomingProjects.data}>
              {(project) => (
                <A href={`/projects/${project.id}`}>
                  <ProjectCard
                    name={project.name}
                    referenceCode={project.referenceCode}
                    startsAt={d(project.startsAt, DateFormat.MONTH_DAY)}
                    endsAt={d(project.endsAt, DateFormat.MONTH_DAY)}
                    status={project.status}
                    capturedLength={project.capturedLength}
                    totalLength={project.totalLength}
                    notes={project.notes}
                    deviations={project.deviations}
                    progress={project.progress}
                  />
                </A>
              )}
            </For>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='previous'>
          <AccordionTrigger>
            {t('PROJECTS.STATUS.PREVIOUS')} ({previousProjects.data?.length})
          </AccordionTrigger>
          <AccordionContent class='flex flex-col space-y-2 p-2'>
            <For each={previousProjects.data}>
              {(project) => (
                <A href={`/projects/${project.id}`}>
                  <ProjectCard
                    name={project.name}
                    referenceCode={project.referenceCode}
                    startsAt={d(project.startsAt, DateFormat.MONTH_DAY)}
                    endsAt={d(project.endsAt, DateFormat.MONTH_DAY)}
                    status={project.status}
                    capturedLength={project.capturedLength}
                    totalLength={project.totalLength}
                    notes={project.notes}
                    deviations={project.deviations}
                    progress={project.progress}
                  />
                </A>
              )}
            </For>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default ProjectOverview;
