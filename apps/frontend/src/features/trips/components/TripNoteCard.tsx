import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { IconChevronDown } from '@tabler/icons-solidjs';
import { Component, Show, createEffect, createSignal } from 'solid-js';
import { useTripNoteMutation } from '../api';
import { useTranslations } from '@/features/i18n';

export interface TripNoteCardProps {
  tripId: string;
  tripNoteId: string;
  createdAt: string;
  note: string;
  selected?: boolean;
  editing?: boolean;
  dirty?: boolean;
  onToggle?: () => void;
  onEdited?: () => void;
}

const TripNoteCard: Component<TripNoteCardProps> = (props) => {
  const { t } = useTranslations();

  const { update } = useTripNoteMutation(props.tripId);

  let inputElement: HTMLInputElement | undefined;

  const [note, setNote] = createSignal(props.note);

  const handleSubmit = async () => {
    try {
      await update.mutateAsync({
        id: props.tripNoteId,
        note: {
          note: note(),
        },
      });
      props.onEdited?.();
    } catch (error) {
      // ignored
    }
  };

  createEffect(() => {
    if (props.editing && inputElement) {
      inputElement.focus();
    }
  });

  return (
    <div>
      <p class='text-sm text-gray-600 dark:text-gray-400'>{props.createdAt}</p>
      <div
        onClick={(e) => {
          if (props.editing) return e.preventDefault();
          props.onToggle?.();
        }}
        class={cn(
          'select-none space-y-2 overflow-hidden rounded-md border bg-gray-100 p-2 transition-colors hover:cursor-pointer hover:bg-gray-200/40 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800/90',
          props.selected &&
            'border-brand-blue-500 dark:border-brand-blue-600 bg-brand-blue-50/40 dark:bg-brand-blue-950/60 hover:bg-brand-blue-50/80 dark:hover:bg-brand-blue-950/80'
        )}
      >
        <div class='flex gap-2'>
          <Input
            class={cn(
              'border-0 text-base',
              props.editing
                ? 'border'
                : 'placeholder:text-gray-950 hover:cursor-pointer focus-visible:ring-0 dark:placeholder:text-gray-50'
            )}
            value={note()}
            onChange={(e) => setNote(e.target.value)}
            readOnly={!props.editing}
            ref={inputElement}
          />

          <Show when={props.editing}>
            <Button onClick={handleSubmit}>{t('GENERAL.SAVE')}</Button>
          </Show>
        </div>

        <div class='flex items-center text-xs text-gray-600 dark:text-gray-400'>
          <IconChevronDown class='size-4' />
          <p>{t('NOTES.CLICK_TO_EXPAND')}</p>
        </div>
      </div>
    </div>
  );
};

export default TripNoteCard;
