import { cn } from '@/lib/utils';
import { DateAsString } from '@isi-insight/client';
import { Component } from 'solid-js';

export interface TripStatusBadgeProps {
  endedAt?: DateAsString;
}

const TripStatusBadge: Component<TripStatusBadgeProps> = (props) => {
  const tripStatus = () => {
    return props.endedAt != undefined ? 'ENDED' : 'ACTIVE';
  };

  return (
    <p
      class={cn(
        'text-success-800 dark:text-success-500 dark:bg-success-950 bg-success-100 rounded-md px-2 py-1 text-xs',
        tripStatus() === 'ENDED' &&
          'bg-gray-500 text-gray-50 dark:bg-gray-800 dark:text-gray-50'
      )}
    >
      {tripStatus()}
    </p>
  );
};

export default TripStatusBadge;
