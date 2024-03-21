import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Indicator } from '@/components/ui/indicator';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { SubmitHandler, createForm, zodForm } from '@modular-forms/solid';
import { A, useNavigate, useParams } from '@solidjs/router';
import {
  IconChevronLeft,
  IconCurrentLocation,
  IconDatabase,
  IconMessage,
  IconPhoto,
  IconVideo,
} from '@tabler/icons-solidjs';
import dayjs from 'dayjs';
import { Component, createSignal } from 'solid-js';
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

  const [isDialogOpen, setIsDialogOpen] = createSignal(false);

  const handleSubmit: SubmitHandler<TripNoteForm> = async (values) => {
    try {
      await create.mutateAsync({ ...values, tripId: params.tripId });
      setIsDialogOpen(false);
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

      navigate('../..');
    } catch (error) {
      // ignored
    }
  };

  return (
    <>
      <div class='absolute bottom-0 w-full rounded-md bg-gray-50 p-2 md:bottom-auto md:left-4 md:top-4 md:w-1/2 lg:w-2/5 xl:w-1/3'>
        <div class='flex flex-col'>
          <div class='hidden md:flex'>
            <A
              href={`/projects/${params.projectId}`}
              class='flex items-center text-sm text-gray-600 hover:underline'
            >
              <IconChevronLeft size={16} />
              <p class='flex-none'>Back</p>
            </A>
          </div>
        </div>
        <div class='space-y-2'>
          <div class='flex flex-col justify-between space-y-2 md:flex-row md:flex-wrap'>
            <div class='order-first md:order-none'>
              <h1 class='text-3xl font-bold'>
                Project 1 - Trip {tripDetails.data?.sequenceNumber}
              </h1>
              <h2 class='text-sm'>21 Jan - 31 Mar</h2>
            </div>
            <Dialog open={isDialogOpen()} onOpenChange={setIsDialogOpen}>
              <DialogTrigger as={Button} class='order-last md:order-none'>
                <div class='flex items-center gap-2'>
                  <IconMessage />
                  <p class='md:hidden'>Add note</p>
                </div>
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
            <div class='order-2 w-full text-center md:order-none'>
              <Progress class='rounded-lg' value={20} />
              <p>{'2 000 / 10 000 m'}</p>
            </div>
          </div>
          <section class='grid grid-cols-2 gap-2 text-sm md:grid-cols-4'>
            <Indicator
              variant={'warning'}
              icon={<IconDatabase />}
              indicates='Storage left'
              status='20%'
            />
            <Indicator
              variant={'success'}
              icon={<IconCurrentLocation />}
              indicates='GPS'
              status='100%'
            />
            <Indicator
              variant={'undetermined'}
              icon={<IconVideo />}
              indicates='Capture'
              status='Inactive'
            />
            <Indicator
              variant={'error'}
              icon={<IconPhoto />}
              indicates='Capture rate'
              status='55%'
            />
          </section>
          <Button
            onClick={handleEndTrip}
            variant='destructive'
            class='w-full md:hidden'
          >
            End trip {tripDetails.data?.endedAt ? ' (ended)' : ''}
          </Button>
        </div>
      </div>
      <div class='absolute bottom-4 left-4 hidden w-full rounded-md bg-gray-50 p-2 md:block md:w-1/2 lg:w-2/5 xl:w-1/3'>
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
