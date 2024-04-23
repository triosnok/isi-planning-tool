import { cn } from '@/lib/utils';
import { Component } from 'solid-js';

export interface TagCardProps {
  tag: string;
  selected?: boolean;
  onToggle?: () => void;
}

const TagCard: Component<TagCardProps> = (props) => {
  return (
    <div
      onClick={props.onToggle}
      class={cn(
        'select-none overflow-hidden rounded-lg border p-2 transition-colors hover:cursor-pointer hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900',
        props.selected &&
          'border-brand-blue-500 dark:border-brand-blue-600 bg-brand-blue-50/40 dark:bg-brand-blue-950/60 hover:bg-brand-blue-50/80 dark:hover:bg-brand-blue-950/80'
      )}
    >
      {props.tag}
    </div>
  );
};

export default TagCard;
