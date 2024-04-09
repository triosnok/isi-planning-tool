import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateFormat, useTranslations } from '@/features/i18n';
import {
  SubmitHandler,
  createForm,
  reset,
  setValue,
  zodForm,
} from '@modular-forms/solid';
import { IconPencil, IconSend2, IconTrash } from '@tabler/icons-solidjs';
import { Component, For, createMemo, createSignal } from 'solid-js';
import { z } from 'zod';
import { useTripNoteDetailsQuery, useTripNoteMutation } from '../api';
import TripNoteCard from './TripNoteCard';

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
    initialValues: { note: '' },
  });

  const handleSubmit: SubmitHandler<TripNoteForm> = async (values) => {
    try {
      await create.mutateAsync({ ...values, tripId: props.tripId });
      reset(form);
    } catch (error) {
      // ignored
    }
  };

  const { t, d } = useTranslations();

  return (
    <section class='flex h-full flex-col overflow-hidden rounded-md bg-gray-50 p-2 dark:bg-gray-900 pointer-events-auto'>
      <div class='space-y-2'>
        <p class='text-2xl font-semibold'>{t('NOTES.TITLE')}</p>

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
            <IconPencil />
          </Button>
          <Button
            disabled={tripNoteId() === undefined}
            variant='destructive'
            class='w-full'
          >
            <IconTrash />
          </Button>
        </div>
      </div>

      <div class='my-2 space-y-2 overflow-y-auto pb-1'>
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
      </div>
    </section>
  );
};

export default TripNoteModule;
