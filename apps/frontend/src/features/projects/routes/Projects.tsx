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
import dayjs, { type Dayjs } from 'dayjs';

const Projects: Component = () => {
  const projects = useProjectsQuery();

  return (
    <div>
      <div class='space-y-2 p-2'>
        <div class='flex items-center justify-between'>
          <h1 class='text-4xl font-bold'>Projects</h1>
          <A href='/projects/new'>
            <Button>
              <IconPlus />
            </Button>
          </A>
        </div>
        <Input placeholder='Search...' />
      </div>
      <Accordion multiple={true} defaultValue={['ongoing', 'upcoming']}>
        <AccordionItem value='ongoing'>
          <AccordionTrigger>Ongoing</AccordionTrigger>
          <AccordionContent class='space-y-2 p-2'>
            <For each={projects.data}>
              {(project) => (
                <ProjectCard
                  name={project.name}
                  referenceCode={project.referenceCode}
                  startsAt={dayjs(project.startsAt).format('DD MMM')}
                  endsAt={dayjs(project.endsAt).format('DD MMM')}
                />
              )}
            </For>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='upcoming'>
          <AccordionTrigger>Upcoming</AccordionTrigger>
          <AccordionContent class='space-y-2 p-2'></AccordionContent>
        </AccordionItem>
        <AccordionItem value='previous'>
          <AccordionTrigger>Previous</AccordionTrigger>
          <AccordionContent class='space-y-2 p-2'></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Projects;
