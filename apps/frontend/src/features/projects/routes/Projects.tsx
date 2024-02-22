import Header from '@/components/layout/Header';
import MapRailingLayer from '@/components/map/MapRailingLayer';
import MapRoot from '@/components/map/MapRoot';
import ProjectCard from '@/components/projects/ProjectCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Component } from 'solid-js';
import { IconPlus, IconSearch } from '@tabler/icons-solidjs';

const Projects: Component = () => {
  return (
    <>
      <Header />
      <main class='flex h-screen justify-between'>
        <div class='w-1/4'>
          <div>
            <div class='space-y-2 p-2'>
              <div class='flex items-center justify-between'>
                <h1 class='text-4xl font-bold'>Projects</h1>
                <Button>
                  <IconPlus />
                </Button>
              </div>
              <Input placeholder='Search...' />
            </div>
            <Accordion multiple={true} defaultValue={['ongoing', 'upcoming']}>
              <AccordionItem value='ongoing'>
                <AccordionTrigger class='bg-gray-100 px-2 py-1 text-xl font-semibold'>
                  Ongoing
                </AccordionTrigger>
                <AccordionContent class='space-y-2 p-2'>
                  <ProjectCard />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='upcoming'>
                <AccordionTrigger class='bg-gray-100 px-2 py-1 text-xl font-semibold'>
                  Upcoming
                </AccordionTrigger>
                <AccordionContent class='space-y-2 p-2'>
                  <ProjectCard />
                  <ProjectCard />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='previous'>
                <AccordionTrigger class='bg-gray-100 px-2 py-1 text-xl font-semibold'>
                  Previous
                </AccordionTrigger>
                <AccordionContent class='space-y-2 p-2'>
                  <ProjectCard />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div class='w-3/4'>
          <MapRoot class='h-full w-full'>
            <MapRailingLayer />
          </MapRoot>
        </div>
      </main>
    </>
  );
};

export default Projects;
