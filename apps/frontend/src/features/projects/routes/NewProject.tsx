import PlanCard from '@/components/plans/PlanCard';
import ProjectCard from '@/components/projects/ProjectCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, SubmitHandler, createForm, zodForm } from '@modular-forms/solid';
import { A, useNavigate } from '@solidjs/router';
import { IconPlus, IconChevronLeft } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';
import { z } from 'zod';

const NewProjectSchema = z.object({
  name: z.string(),
  reference: z.string(),
  from: z.date(),
  to: z.date(),
});

type NewProjectForm = z.infer<typeof NewProjectSchema>;

const NewProject: Component = () => {
  const [, { Form, Field }] = createForm({
    validate: zodForm(NewProjectSchema),
  });
  const navigate = useNavigate();
  //const { mutateAsync } = useNewProjectMutation();
  const handleSubmit: SubmitHandler<NewProjectForm> = async (values) => {
    try {
      //await mutateAsync(values);
      navigate('/projects');
    } catch (error) {
      // ignored
    }
  };

  return (
    <div>
      <div class='p-2'>
        <div class='flex flex-col'>
          <div class='flex'>
            <A
              href='/projects'
              class='flex items-center text-sm text-gray-600 hover:underline'
            >
              <IconChevronLeft size={16} />
              <p class='flex-none'>Back</p>
            </A>
          </div>
        </div>
        <Form id='new-project-form' onSubmit={handleSubmit}>
          <h1 class='text-4xl font-bold'>New project</h1>
          <Label for='name'>Name</Label>
          <Field name='name'>
            {(field, props) => (
              <Input
                {...props}
                type='text'
                id='name'
                placeholder='Name'
                value={field.value}
              />
            )}
          </Field>
          <Label for='reference'>Project reference</Label>
          <Field name='reference'>
            {(field, props) => (
              <Input
                {...props}
                type='text'
                id='reference'
                placeholder='Project reference'
                value={field.value}
              />
            )}
          </Field>
          <div class='flex gap-2'>
            <div class='grow'>
              <Label for='from'>Start date</Label>
              <Field name='from' type='Date'>
                {(field, props) => (
                  <Input
                    {...props}
                    type='date'
                    id='from'
                    placeholder='Start date'
                    // value={field.value}
                  />
                )}
              </Field>
            </div>
            <div class='grow'>
              <Label for='to'>End date</Label>
              <Field name='to' type='Date'>
                {(field, props) => (
                  <Input
                    {...props}
                    type='date'
                    id='to'
                    placeholder='End date'
                    // value={field.value}
                  />
                )}
              </Field>
            </div>
          </div>
        </Form>
      </div>

      <Accordion multiple={true} defaultValue={['plans', 'railings']}>
        <AccordionItem value='plans'>
          <AccordionTrigger>Plans (3)</AccordionTrigger>
          <AccordionContent class='space-y-2 p-2'>
            <PlanCard />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='railings'>
          <AccordionTrigger>Railings (200)</AccordionTrigger>
          <AccordionContent class='space-y-2 p-2'></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default NewProject;
