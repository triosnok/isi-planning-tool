import TextArea from '@/components/input/TextArea';
import { useMap } from '@/components/map/MapRoot';
import { parseGeometry } from '@/components/map/utils';
import { Button } from '@/components/ui/button';
import { DateFormat, useTranslations } from '@/features/i18n';
import { TripNoteDetails } from '@isi-insight/client';
import {
  SubmitHandler,
  createForm,
  reset,
  setValue,
  zodForm,
} from '@modular-forms/solid';
import { IconPencil, IconSend2, IconTrash } from '@tabler/icons-solidjs';
import { Point } from 'ol/geom';
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
  showMapNotes?: boolean;
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

  let noteInputElement: HTMLTextAreaElement | undefined;

  createEffect(() => {
    if (noteInputElement) {
      noteInputElement.focus();
    }
  });

  const { t } = useTranslations();

  return (
    <section class='pointer-events-auto flex h-full flex-col overflow-hidden rounded-md bg-gray-50 p-2 dark:bg-gray-950 md:dark:bg-gray-900'>
      <div class='space-y-2'>
        <p class='text-2xl font-semibold'>{t('NOTES.TITLE')}</p>

        <Form onSubmit={handleSubmit} class='flex'>
          <Field name='note' type='string'>
            {(field, props) => (
              <div class='relative w-full'>
                <TextArea
                  {...props}
                  name={field.name}
                  placeholder={t('NOTES.NOTE') + '...'}
                  value={field.value}
                  onChange={(v) => setValue(form, 'note', v)}
                  ref={noteInputElement as any}
                  class='pr-10'
                />

                <Button class='absolute right-2 top-1/2 aspect-square -translate-y-1/2 rounded-full p-0'>
                  <IconSend2 class='size-5' />
                </Button>
              </div>
            )}
          </Field>
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
            <TripNoteItem
              tripId={props.tripId}
              note={note}
              onToggle={() => handleTripNoteToggled(note.id)}
              selected={selectedTripNotes().includes(note.id)}
              editing={editTripNote() === note.id}
              onEdited={() => setEditTripNote(undefined)}
            />
          )}
        </For>
      </div>
    </section>
  );
};

const TripNoteItem: Component<{
  tripId: string;
  note: TripNoteDetails;
  editing: boolean;
  selected: boolean;
  onToggle: () => void;
  onEdited: () => void;
  markers?: boolean;
}> = (props) => {
  const { map } = useMap();
  const { d } = useTranslations();
  let cardElement: HTMLDivElement;

  const handleMarkerToggle = () => {
    if (!props.selected) cardElement.scrollIntoView();
    props.onToggle();
  };

  const handleCardToggle = () => {
    if (!props.selected && props.note.geometry) {
      const geom = parseGeometry<Point>(props.note.geometry);

      map.getView().animate({
        center: geom.getCoordinates(),
        duration: 300,
      });
    }

    props.onToggle();
  };

  return (
    <>
      <TripNoteCard
        ref={cardElement!}
        tripId={props.tripId}
        tripNoteId={props.note.id}
        createdAt={d(props.note.createdAt, DateFormat.DATETIME)}
        note={props.note.note}
        onToggle={handleCardToggle}
        selected={props.selected}
        editing={props.editing}
        onEdited={props.onEdited}
      />

      <Show when={props.markers !== false}>
        <TripNoteMarker
          note={props.note}
          onSelected={handleMarkerToggle}
          selected={props.selected}
        />
      </Show>
    </>
  );
};

export default TripNoteModule;
