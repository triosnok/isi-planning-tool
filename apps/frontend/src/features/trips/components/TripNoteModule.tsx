import { z } from 'zod';
import { useTripNoteMutation } from '../api';
import { Component } from 'solid-js';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IconSend2, IconPencil, IconTrash } from '@tabler/icons-solidjs';
import TripNoteCard from './TripNoteCard';
import { useTranslations } from '@/features/i18n';
import { SubmitHandler, createForm, zodForm } from '@modular-forms/solid';

export interface TripNoteModuleProps {
  tripId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TripNoteSchema = z.object({
  note: z.string(),
});

export type TripNoteForm = z.infer<typeof TripNoteSchema>;

const TripNoteModule: Component<TripNoteModuleProps> = (props) => {
  const { create } = useTripNoteMutation(props.tripId);
  const [form, { Form, Field }] = createForm({
    validate: zodForm(TripNoteSchema),
  });


  const handleSubmit: SubmitHandler<TripNoteForm> = async (values) => {
    try {
      await create.mutateAsync({ ...values, tripId: props.tripId });
    } catch (error) {
      // ignored
    }
  };
  
  const { t } = useTranslations();

  return (
    <section class='absolute left-4 top-64 hidden w-full rounded-md bg-gray-50 p-2 md:block md:w-1/2 lg:w-2/5 xl:w-1/3 dark:bg-gray-900'>
      <div class='space-y-2'>
        <p class='text-2xl font-semibold'>Notes</p>
        <label
          class={cn(
            'hidden flex-1 items-center justify-center rounded-md border p-2 focus-within:ring-2 md:flex',
            'border-gray-300 bg-gray-50 ring-gray-300',
            'dark:border-gray-800 dark:bg-gray-900 dark:ring-gray-400'
          )}
        >
          <input
            class='h-8 flex-1 bg-transparent focus:outline-none'
            placeholder={t('NOTES.NOTE') + '...'}
          />

          <div class='bg-brand-blue hover:bg-brand-blue-800/90 rounded-full p-2'>
            <IconSend2 class='size-5 text-gray-50' />
          </div>
        </label>
        <div class='flex justify-between space-x-2'>
          <Button class='w-full bg-gray-100 hover:bg-gray-100'>
            <IconPencil class='text-gray-600' />
          </Button>
          <Button class='w-full bg-gray-100 hover:bg-gray-100'>
            <IconTrash class='text-gray-600' />
          </Button>
        </div>
      </div>

      <TripNoteCard
        timestamp='01/31/2024 9:43 AM'
        note='Guardrail missing. Pls fix.'
      />
    </section>
  );
};

export default TripNoteModule;
