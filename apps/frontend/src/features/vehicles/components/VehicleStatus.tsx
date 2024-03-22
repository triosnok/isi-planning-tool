import { cn } from '@/lib/utils';
import { VehicleDetails } from '@isi-insight/client';
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
} from '@tabler/icons-solidjs';
import { Component, Show } from 'solid-js';

export interface VehicleStatusProps {
  vehicle: VehicleDetails;
}

const VehicleStatus: Component<VehicleStatusProps> = (props) => {
  return (
    <Show
      when={props.vehicle.available}
      fallback={
        <p class='text-error-500 absolute right-2 top-2 flex items-center gap-0.5 text-sm'>
          <IconCircleXFilled class='h-4 w-4' />
          <span>Unavailable</span>
        </p>
      }
    >
      <p class='text-success-500 absolute right-2 top-2 flex items-center gap-0.5 text-sm'>
        <IconCircleCheckFilled class='h-4 w-4' />
        <span>Available</span>
      </p>
    </Show>
  );
};

export default VehicleStatus;
