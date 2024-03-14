import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { SubmitHandler, createForm, zodForm } from '@modular-forms/solid';
import { A, useNavigate, useParams } from '@solidjs/router';
import { IconChevronLeft, IconMessage } from '@tabler/icons-solidjs';
import dayjs from 'dayjs';
import { Component } from 'solid-js';
import { z } from 'zod';
import {
  useTripDetailsQuery,
  useTripMutation,
  useTripNoteMutation,
} from '../api';

const TripNoteSchema = z.object({
  note: z.string(),
});

type TripNoteForm = z.infer<typeof TripNoteSchema>;

const Trip: Component = () => {
  const params = useParams();
  const { create } = useTripNoteMutation(params.tripId);
  const { update } = useTripMutation();
  const navigate = useNavigate();
  const [form, { Form, Field }] = createForm({
    validate: zodForm(TripNoteSchema),
  });
  const tripDetails = useTripDetailsQuery(params.tripId);

  const handleSubmit: SubmitHandler<TripNoteForm> = async (values) => {
    try {
      await create.mutateAsync(values);
    } catch (error) {
      // ignored
    }
  };

  const handleEndTrip = async () => {
    try {
      await update.mutateAsync({
        tripId: params.tripId,
        endedAt: dayjs().toDate(),
      });

      navigate('/projects');
    } catch (error) {
      // ignored
    }
  };

  return (
    <>
      <div class='bg-background absolute left-4 top-4 w-96 rounded-md p-2'>
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
              <h1 class='text-3xl font-bold'>Project 1 - Trip 3</h1>
              <h2 class='text-sm'>21 Jan - 31 Mar</h2>
            </div>
            <Dialog>
              <DialogTrigger as={Button}>
                <IconMessage />
              </DialogTrigger>
              <DialogContent class='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Add note</DialogTitle>
                  <DialogDescription>Add a note to this trip</DialogDescription>
                </DialogHeader>
                <Form
                  id='add-trip-note'
                  onSubmit={handleSubmit}
                  class='flex flex-col gap-4'
                >
                  <Field name='note'>
                    {(field, props) => (
                      <Input
                        {...props}
                        type='text'
                        id='note'
                        placeholder='Note'
                        value={field.value}
                      />
                    )}
                  </Field>
                  <Button type='submit'>Save</Button>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div class='text-center'>
            <Progress class='rounded-lg' value={20} />
            <p>{'2 000 / 10 000 m'}</p>
          </div>
        </div>
      </div>
      <div class='bg-background absolute bottom-4 left-4 w-96 rounded-md p-2'>
        <Button
          onClick={handleEndTrip}
          variant='destructive'
          class='flex w-full'
        >
          End trip {tripDetails.data?.endedAt ? ' (ended)' : ''}
        </Button>
      </div>
    </>
  );
};

export default Trip;
