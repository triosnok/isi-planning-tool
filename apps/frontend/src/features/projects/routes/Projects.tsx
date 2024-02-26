import ProjectCard from '@/components/projects/ProjectCard';
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
import { Component } from 'solid-js';
//import { useProjects } from '../api';

const Projects: Component = (props) => {
  //const projectsQuery = useProjects();
  //const data = projectsQuery.data;

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
            <ProjectCard
              name='Ålesund Project'
              referenceCode='ABC123'
              startsAt='31 Jan'
              endsAt='31 Feb'
              geoCharacteristics='E39 - E136 - E137'
              coverage='1 523 / 3 944 m'
              status='Done'
              deviationAmount={4}
              noteAmount={18}
              progress={30}
            />
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
