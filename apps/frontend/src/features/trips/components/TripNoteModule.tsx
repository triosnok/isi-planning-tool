import { z } from 'zod';
import { useTripNoteDetailsQuery, useTripNoteMutation } from '../api';
import { Component, For, createMemo, createSignal } from 'solid-js';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IconSend2, IconPencil, IconTrash } from '@tabler/icons-solidjs';
import TripNoteCard from './TripNoteCard';
import { DateFormat, useTranslations } from '@/features/i18n';
import {
  Field,
  SubmitHandler,
  createForm,
  zodForm,
} from '@modular-forms/solid';
import { Input } from '@/components/ui/input';

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
  const notes = useTripNoteDetailsQuery(props.tripId);
  const { create } = useTripNoteMutation(props.tripId);

  const [selectedTripNotes, setSelectedTripNotes] = createSignal<string[]>([]);

  const handleTripNoteToggled = (tripNoteId: string) => {
    const notes = selectedTripNotes();

    if (notes.includes(tripNoteId)) {
      setSelectedTripNotes((n) => n.filter((id) => id !== tripNoteId));
    } else {
      setSelectedTripNotes([...notes, tripNoteId]);
    }
  };

  const tripNoteId = createMemo(() => {
    return selectedTripNotes().length === 1
      ? selectedTripNotes()[0]
      : undefined;
  });

  const TripNoteSchema = z.object({
    note: z.string(),
  });

  type TripNoteForm = z.infer<typeof TripNoteSchema>;

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

  const { t, d } = useTranslations();

  return (
    <section class='absolute left-4 top-64 hidden w-full overflow-hidden rounded-md bg-gray-50 p-2 md:block md:w-1/2 lg:w-2/5 xl:w-1/3 dark:bg-gray-900'>
      <div class='space-y-2'>
        <p class='text-2xl font-semibold'>Notes</p>

        <Form onSubmit={handleSubmit} class='flex'>
          <Field name='note' type='string'>
            {(field, props) => (
              <Input
                {...props}
                type='text'
                id='note'
                placeholder={t('NOTES.NOTE') + '...'}
                value={field.value}
                class='rounded-r-none border-r-0'
              />
            )}
          </Field>

          <Button class='rounded-l-none rounded-r-xl'>
            <IconSend2 />
          </Button>
        </Form>

        <div class='flex justify-between space-x-2'>
          <Button disabled={tripNoteId() === undefined} class='w-full '>
            <IconPencil class='' />
          </Button>
          <Button
            disabled={tripNoteId() === undefined}
            variant='destructive'
            class='w-full'
          >
            <IconTrash class='' />
          </Button>
        </div>
      </div>

      <For each={notes.data}>
        {(note) => (
          <TripNoteCard
            createdAt={d(note.createdAt, DateFormat.DATETIME)}
            note={note.note}
            onToggle={() => handleTripNoteToggled(note.id)}
            selected={selectedTripNotes().includes(note.id)}
          />
        )}
      </For>
    </section>
  );
};

export default TripNoteModule;
