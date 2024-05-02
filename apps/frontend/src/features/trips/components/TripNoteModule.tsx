import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateFormat, useTranslations } from '@/features/i18n';
import {
  SubmitHandler,
  createForm,
  reset,
  zodForm,
} from '@modular-forms/solid';
import { IconPencil, IconSend2, IconTrash } from '@tabler/icons-solidjs';
import {
  Component,
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
} from 'solid-js';
import { z } from 'zod';
import { useTripNoteDetailsQuery, useTripNoteMutation } from '../api';
import TripNoteCard from './TripNoteCard';
import TripNoteMarker from './TripNoteMarker';

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
  const { create, deleteNote } = useTripNoteMutation(props.tripId);

  const [selectedTripNotes, setSelectedTripNotes] = createSignal<string[]>([]);
  const [editTripNote, setEditTripNote] = createSignal<string>();

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

  const deleteTripNote = async (id: string) => {
    try {
      await deleteNote.mutateAsync(id);
      setSelectedTripNotes([]);
      setEditTripNote(undefined);
    } catch (error) {
      // ignored
    }
  };

  let noteInputElement: HTMLInputElement | undefined;

  createEffect(() => {
    if (noteInputElement) {
      noteInputElement.focus();
    }
  });

  const { t, d } = useTranslations();

  return (
    <>
      <section class='pointer-events-auto flex h-full flex-col overflow-hidden rounded-md bg-gray-50 p-2 dark:bg-gray-900'>
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
                  ref={noteInputElement}
                />
              )}
            </Field>

            <Button class='rounded-l-none rounded-r-xl'>
              <IconSend2 />
            </Button>
          </Form>

          <div class='flex justify-between space-x-2'>
            {/* Cancel button */}
            <Show when={editTripNote() !== undefined}>
              <Button
                onclick={(e) => setEditTripNote(undefined)}
                disabled={tripNoteId() === undefined}
                class='w-full'
              >
                {t('GENERAL.CANCEL')}
              </Button>
            </Show>

            {/* Edit button */}
            <Show when={editTripNote() === undefined}>
              <Button
                onclick={(e) => setEditTripNote(tripNoteId())}
                disabled={tripNoteId() === undefined}
                class='w-full'
              >
                <IconPencil />
              </Button>
            </Show>

            <Button
              disabled={tripNoteId() === undefined}
              onclick={(e) => deleteTripNote(tripNoteId()!)}
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
                tripId={props.tripId}
                tripNoteId={note.id}
                createdAt={d(note.createdAt, DateFormat.DATETIME)}
                note={note.note}
                onToggle={() => {
                  handleTripNoteToggled(note.id);
                }}
                selected={selectedTripNotes().includes(note.id)}
                editing={editTripNote() === note.id}
                onEdited={() => {
                  setEditTripNote(undefined);
                }}
              />
            )}
          </For>
        </div>
      </section>

      <For each={notes.data}>
        {(note) => (
          <TripNoteMarker
            note={note}
            onSelected={() => handleTripNoteToggled(note.id)}
            selected={selectedTripNotes().includes(note.id)}
          />
        )}
      </For>
    </>
  );
};

export default TripNoteModule;
