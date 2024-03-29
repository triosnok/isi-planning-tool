import { cn } from '@/lib/utils';
import { IconChevronDown } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface TripNoteCardProps {
  timestamp: string;
  note: string;
  selected?: boolean;
  onToggle?: () => void;
}

const TripNoteCard: Component<TripNoteCardProps> = (props) => {
  return (
    <>
      <p class='mt-2 text-sm text-gray-500'>{props.timestamp}</p>
      <div
        onClick={props.onToggle}
        class={cn(
          'select-none space-y-2 overflow-hidden rounded-md border bg-gray-100 p-2 outline-1 outline-gray-200 transition-colors hover:cursor-pointer hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900',
          props.selected &&
            'border-brand-blue-500 dark:border-brand-blue-600 bg-brand-blue-50/40 dark:bg-brand-blue-950/60 hover:bg-brand-blue-50/80 dark:hover:bg-brand-blue-950/80'
        )}
      >
        <p>{props.note}</p>
        <div class='flex items-center text-sm text-gray-600'>
          <IconChevronDown />
          <p>Click here to expand</p>
        </div>
      </div>
    </>
  );
};

export default TripNoteCard;
