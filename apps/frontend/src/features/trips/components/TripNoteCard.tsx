import TextArea from '@/components/input/TextArea';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { Collapsible } from '@kobalte/core/collapsible';
import { Ref } from '@solid-primitives/refs';
import { IconChevronDown } from '@tabler/icons-solidjs';
import { Component, Show, createEffect, createSignal } from 'solid-js';
import { useTripNoteMutation } from '../api';

export interface TripNoteCardProps {
  ref?: Ref<HTMLDivElement>;
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
  let inputElement: HTMLTextAreaElement;

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
    if (props.editing) {
      inputElement.focus();
    } else {
      setNote(props.note);
    }
  });

  return (
    <div ref={props.ref}>
      <p class='text-sm text-gray-600 dark:text-gray-400'>{props.createdAt}</p>

      <div
        onClick={(e) => {
          if (props.editing) return e.preventDefault();
          props.onToggle?.();
        }}
        class={cn(
          'flex select-none flex-col gap-2 overflow-hidden rounded-md border bg-gray-100 transition-colors hover:cursor-pointer hover:bg-gray-200/40 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800/90',
          props.selected &&
            'border-brand-blue-500 dark:border-brand-blue-600 bg-brand-blue-50/40 dark:bg-brand-blue-950/60 hover:bg-brand-blue-50/80 dark:hover:bg-brand-blue-950/80'
        )}
      >
        <div class='relative flex min-h-12 gap-2'>
          <Show when={!props.selected}>
            <p class='absolute left-0 top-0 truncate whitespace-pre-wrap border border-transparent p-2 text-sm text-gray-800 dark:text-gray-50'>
              <span class='line-clamp-2'>{note()}</span>
            </p>
          </Show>

          <Collapsible open={props.selected} class='flex-1'>
            <Collapsible.Content class='animate-collapsible-up ui-expanded:animate-collapsible-down relative flex-1 overflow-hidden p-2'>
              {/* hack to make the collapsible animation work as intended, size isn't measured properly when only using textarea */}
              <p class='invisible whitespace-pre-wrap text-sm' aria-hidden>
                {note()}
              </p>

              <TextArea
                autoResize
                class={cn(
                  'absolute left-0 top-0 m-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] overflow-y-hidden border-transparent p-0 text-sm outline-none',
                  !props.editing &&
                    'cursor-pointer border-transparent focus-visible:ring-transparent dark:border-transparent dark:focus-visible:ring-transparent'
                )}
                value={note()}
                onChange={setNote}
                readOnly={!props.editing}
                // the ref type seems to be wrong in kobalte, but it works
                ref={inputElement! as any}
              />
            </Collapsible.Content>
          </Collapsible>

          <Show when={props.editing}>
            <Button onClick={handleSubmit}>{t('GENERAL.SAVE')}</Button>
          </Show>
        </div>

        <div class='flex items-center px-2 pb-1 text-xs text-gray-600 dark:text-gray-400'>
          <IconChevronDown
            class={cn(
              'size-4',
              props.selected && 'rotate-180 transition-transform'
            )}
          />
          <p>
            <Show
              when={!props.selected}
              fallback={t('NOTES.CLICK_TO_MINIMIZE')}
            >
              {t('NOTES.CLICK_TO_EXPAND')}
            </Show>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripNoteCard;
