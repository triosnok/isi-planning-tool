import ProjectCard from '@/features/projects/components/ProjectCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { A } from '@solidjs/router';
import { IconPlus } from '@tabler/icons-solidjs';
import { Component, For } from 'solid-js';
import { useProjectsQuery } from '../api';
import dayjs from 'dayjs';
import { DateFormat, useTranslations } from '@/features/i18n';

const Projects: Component = () => {
  const ongoingProjects = useProjectsQuery('ONGOING');
  const upcomingProjects = useProjectsQuery('UPCOMING');
  const previousProjects = useProjectsQuery('PREVIOUS');
  const { t, d } = useTranslations();

  return (
    <div>
      <div class='space-y-2 p-2'>
        <div class='flex items-center justify-between'>
          <h1 class='text-4xl font-bold'>{t('PROJECTS.TITLE')}</h1>
          <A href='/projects/new'>
            <Button>
              <IconPlus />
            </Button>
          </A>
        </div>
        <Input placeholder={t('NAVIGATION.SEARCH')} />
      </div>
      <Accordion multiple={true} defaultValue={['ongoing', 'upcoming']}>
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
    </div>
  );
};

export default Projects;
