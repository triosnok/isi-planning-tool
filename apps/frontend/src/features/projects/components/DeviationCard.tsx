import { cn } from '@/lib/utils';
import { IconCamera } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface DeviationCardProps {
  type: string;
  roadSystemReference: string;
  class?: string;
  onClick?: () => void;
}

const DeviationCard: Component<DeviationCardProps> = (props) => {
  return (
    <div
      class={cn(
        'flex items-center justify-between gap-1 hover:bg-gray-100 dark:hover:bg-gray-900',
        props.class
      )}
      onClick={props.onClick}
    >
      <div>
        <p class='font-medium text-lg'>{props.type}</p>

        <span class='text-xs text-gray-600 dark:text-gray-400'>
          {props.roadSystemReference}
        </span>
      </div>

      <IconCamera class='size-5' />
    </div>
  );
};

export default DeviationCard;
