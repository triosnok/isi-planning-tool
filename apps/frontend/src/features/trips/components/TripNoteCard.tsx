import { cn } from '@/lib/utils';
import { IconChevronDown } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface TripNoteCardProps {
  createdAt: string;
  note: string;
  selected?: boolean;
  onToggle?: () => void;
}

const TripNoteCard: Component<TripNoteCardProps> = (props) => {
  return (
    <div>
      <p class='text-sm text-gray-600 dark:text-gray-400'>{props.createdAt}</p>
      <div
        onClick={props.onToggle}
        class={cn(
          'select-none space-y-2 overflow-hidden rounded-md border bg-gray-100 p-2 transition-colors hover:cursor-pointer hover:bg-gray-200/40 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800/90',
          props.selected &&
            'border-brand-blue-500 dark:border-brand-blue-600 bg-brand-blue-50/40 dark:bg-brand-blue-950/60 hover:bg-brand-blue-50/80 dark:hover:bg-brand-blue-950/80'
        )}
      >
        <p>{props.note}</p>

        <div class='flex items-center text-xs text-gray-600 dark:text-gray-400'>
          <IconChevronDown class='size-4' />
          <p>Click to expand</p>
        </div>
      </div>
    </div>
  );
};
//TODO: adjust the styling here, especially dark mode because i don't know if its consistent with how the other components are styled

export default TripNoteCard;
