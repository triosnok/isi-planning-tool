import { cn } from '@/lib/utils';
import { IconNavigation } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';
import { useMap } from './MapRoot';

export interface MapFollowVehicleToggleProps {
  class?: string;
}

const MapFollowVehicleToggle: Component<MapFollowVehicleToggleProps> = (
  props
) => {
  const ctx = useMap();

  return (
    <button
      class={cn(
        'rounded-md border p-1 shadow transition-colors',
        'border-gray-300 bg-gray-50 hover:bg-gray-200',
        'dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800',
        ctx.follow() &&
          'bg-brand-blue-700 dark:bg-brand-blue-700 hover:bg-brand-blue-600 dark:hover:bg-brand-blue-600 dark:hover-bg-brand-blue-600 text-gray-50 dark:text-gray-50',
        props.class
      )}
      onClick={ctx.toggleFollow}
    >
      <IconNavigation />
      <span class='sr-only'>Follow vehicle</span>
    </button>
  );
};

export default MapFollowVehicleToggle;
