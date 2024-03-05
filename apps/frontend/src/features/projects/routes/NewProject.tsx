import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PlanCard from '@/features/projects/components/PlanCard';
import RailingCard from '@/features/projects/components/RailingCard';
import {
  SubmitHandler,
  createForm,
  setValue,
  zodForm,
} from '@modular-forms/solid';
import { A, useNavigate } from '@solidjs/router';
import { IconChevronLeft } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';
import { z } from 'zod';
import { useProjectsMutation } from '../api';
import DatePicker from '@/components/temporal/DatePicker';
import dayjs from 'dayjs';

const ProjectSchema = z.object({
  name: z.string(),
  referenceCode: z.string(),
  startsAt: z.string(),
  endsAt: z.string().datetime().optional(),
});

type ProjectForm = z.infer<typeof ProjectSchema>;

const NewProject: Component = () => {
  const [form, { Form, Field }] = createForm({
    validate: zodForm(ProjectSchema),
  });
  const navigate = useNavigate();
  const { create } = useProjectsMutation();
  const handleSubmit: SubmitHandler<ProjectForm> = async (values) => {
    try {
      await create.mutateAsync(values);
      navigate('/projects');
    } catch (error) {
      // ignored
    }
  };

  return (
    <Form
      class='flex h-full flex-col justify-between'
      id='new-project-form'
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
          <div>
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
            <Label for='referenceCode'>Project reference</Label>
            <Field name='referenceCode'>
              {(field, props) => (
                <Input
                  {...props}
                  type='text'
                  id='referenceCode'
                  placeholder='Project reference'
                  value={field.value}
                />
              )}
            </Field>
            <div class='flex gap-2'>
              <div class='grow'>
                <Label for='startsAt'>Start date</Label>
                <Field name='startsAt' type='string'>
                  {(field) => (
                    <DatePicker
                      value={dayjs(field.value).toDate()}
                      onChange={(v) =>
                        setValue(
                          form,
                          'startsAt',
                          v!.toISOString() ?? undefined
                        )
                      }
                    />
                  )}
                </Field>
              </div>
              <div class='grow'>
                <Label for='endsAt'>End date</Label>
                <Field name='endsAt'>
                  {(field) => (
                    <DatePicker
                      value={dayjs(field.value).toDate()}
                      onChange={(v) =>
                        setValue(form, 'endsAt', v?.toISOString() ?? undefined)
                      }
                      clearable
                    />
                  )}
                </Field>
              </div>
            </div>
          </div>
        </div>

        <Accordion multiple={true} defaultValue={['plans', 'railings']}>
          <AccordionItem value='plans'>
            <AccordionTrigger>Plans (3)</AccordionTrigger>
            <AccordionContent class='p-2'>
              <div class='flex justify-end'>
                <p class='text-brand-blue hover:cursor-pointer hover:underline'>
                  + Add plan
                </p>
              </div>
              <PlanCard
                startsAt='31 Jan'
                endsAt='24 Feb'
                railingAmount={231}
                length={999}
                car='Corolla (UB 11112)'
                ongoingTripAmount={2}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='railings'>
            <AccordionTrigger>Railings (200)</AccordionTrigger>
            <AccordionContent>
              <RailingCard
                name='EV39..'
                length={302}
                cameraSide='Left'
                direction='With'
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Button type='submit' class='rounded-none'>
        Save
      </Button>
    </Form>
  );
};
// todo: replace with actual data, replace generic button with Button component, add radio functionality on plan selection

export default NewProject;
