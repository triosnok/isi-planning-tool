import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitHandler, createForm, zodForm } from '@modular-forms/solid';
import { A, useNavigate } from '@solidjs/router';
import {
  IconChevronLeft,
  IconCircleCheckFilled,
  IconEdit,
} from '@tabler/icons-solidjs';
import { Component } from 'solid-js';
import { z } from 'zod';
//import { useProjectPlansMutation } from '../api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import VehicleSelect from '@/features/vehicles/components/VehicleSelect';

const ProjectPlanSchema = z.object({
  importUrl: z.string(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  vehicleId: z.string().nullable(),
});

type ProjectPlanForm = z.infer<typeof ProjectPlanSchema>;

const Project: Component = () => {
  const [, { Form, Field }] = createForm({
    validate: zodForm(ProjectPlanSchema),
  });
  const navigate = useNavigate();
  //const { create } = useProjectPlansMutation();
  const handleSubmit: SubmitHandler<ProjectPlanForm> = async (values) => {
    try {
      //await create.mutateAsync(values);
      navigate('/projects');
    } catch (error) {
      // ignored
    }
  };

  return (
    <Form
      class='flex h-full flex-col justify-between'
      id='new-project-plan-form'
      onSubmit={handleSubmit}
    >
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
          <div class='space-y-2'>
            <div class='flex justify-between'>
              <div>
                <h1 class='text-4xl font-bold'>Project</h1>
                <h2>12 Jan - 23 Jan</h2>
                <div class='text-success-500 flex items-center gap-1'>
                  <IconCircleCheckFilled size={16} />
                  <p class='text-sm'>Done</p>
                </div>
              </div>
              <A href='/projects/new'>
                <Button>
                  <IconEdit />
                </Button>
              </A>
            </div>
            <div class='text-center'>
              <Progress class='rounded-lg' value={20} />
              <p>200/1000 m</p>
            </div>
          </div>
        </div>

        <Accordion multiple={true} defaultValue={['plans', 'railings']}>
          <AccordionItem value='plans'>
            <AccordionTrigger>Plans</AccordionTrigger>
            <AccordionContent class='flex flex-col space-y-2 p-2'>
              <div class='flex gap-2'>
                <div class='grow'>
                  <Label for='startsAt'>Start date</Label>
                  <Field name='startsAt' type='string'>
                    {(field, props) => (
                      <Input
                        {...props}
                        type='date'
                        id='startsAt'
                        placeholder='Start date'
                      />
                    )}
                  </Field>
                </div>
                <div class='grow'>
                  <Label for='endsAt'>End date</Label>
                  <Field name='endsAt' type='string'>
                    {(field, props) => (
                      <Input
                        {...props}
                        type='date'
                        id='endsAt'
                        placeholder='End date'
                      />
                    )}
                  </Field>
                </div>
              </div>
              <Label for='vehicle'>Vehicle</Label>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='railings'>
            <AccordionTrigger>Railings</AccordionTrigger>
            <AccordionContent class='flex flex-col space-y-2 p-2'></AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Form>
  );
};

export default Project;
