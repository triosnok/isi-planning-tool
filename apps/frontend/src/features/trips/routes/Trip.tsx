import BackLink from '@/components/navigation/BackLink';
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
import { useTranslations } from '@/features/i18n';
import { SubmitHandler, createForm, zodForm } from '@modular-forms/solid';
import { useNavigate, useParams } from '@solidjs/router';
import {
  IconCurrentLocation,
  IconDatabase,
  IconMessage,
  IconPhoto,
  IconVideo,
} from '@tabler/icons-solidjs';
import { Component, Show, createSignal } from 'solid-js';
import { z } from 'zod';
import { useTripDetailsQuery, useTripNoteMutation } from '../api';
import TripSummaryDialog from '../components/TripSummaryDialog';

const TripNoteSchema = z.object({
  note: z.string(),
});

type TripNoteForm = z.infer<typeof TripNoteSchema>;

const Trip: Component = () => {
  const params = useParams();
  const { create } = useTripNoteMutation(params.tripId);
  const navigate = useNavigate();
  const [form, { Form, Field }] = createForm({
    validate: zodForm(TripNoteSchema),
  });
  const tripDetails = useTripDetailsQuery(params.tripId);

  const [showSummaryDialog, setShowSummaryDialog] = createSignal(false);
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);

  const handleSubmit: SubmitHandler<TripNoteForm> = async (values) => {
    try {
      await create.mutateAsync({ ...values, tripId: params.tripId });
      setIsDialogOpen(false);
    } catch (error) {
      // ignored
    }
  };

  const { t } = useTranslations();

  return (
    <>
      <div class='absolute bottom-0 w-full rounded-md bg-gray-50 p-2 md:bottom-auto md:left-4 md:top-4 md:w-1/2 lg:w-2/5 xl:w-1/3 dark:bg-gray-900'>
        <div class='flex flex-col'>
          <div class='hidden md:flex'>
            <BackLink href='../..' />
          </div>
        </div>
        <div class='space-y-2'>
          <div class='flex flex-col justify-between space-y-2 md:flex-row md:flex-wrap'>
            <div class='order-first md:order-none'>
              <h1 class='text-3xl font-bold'>
                Project 1 - {t('TRIPS.TRIP')} {tripDetails.data?.sequenceNumber}
              </h1>
              <h2 class='text-sm'>21 Jan - 31 Mar</h2>
            </div>
            <Dialog open={isDialogOpen()} onOpenChange={setIsDialogOpen}>
              <DialogTrigger as={Button} class='order-last md:order-none'>
                <div class='flex items-center gap-2'>
                  <IconMessage />
                  <p class='md:hidden'>{t('NOTES.ADD_NOTE')}</p>
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
                  <Button type='submit'>{t('GENERAL.SAVE')}</Button>
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

          <TripSummaryDialog
            tripId={params.tripId}
            open={showSummaryDialog()}
            onOpenChange={setShowSummaryDialog}
          />

          <Show when={!tripDetails.data?.endedAt}>
            <Button
              onClick={() => setShowSummaryDialog(true)}
              variant='destructive'
              class='w-full md:hidden'
            >
              {t('TRIPS.END_TRIP')}
            </Button>
          </Show>
        </div>
      </div>
      <Show when={!tripDetails.data?.endedAt}>
        <div class='absolute bottom-4 left-4 hidden w-full rounded-md bg-gray-50 p-2 md:block md:w-1/2 lg:w-2/5 xl:w-1/3 dark:bg-gray-900'>
          <Button
            onClick={() => setShowSummaryDialog(true)}
            variant='destructive'
            class='flex w-full'
          >
            {t('TRIPS.END_TRIP')}
          </Button>
        </div>
      </Show>
    </>
  );
};

export default Trip;
