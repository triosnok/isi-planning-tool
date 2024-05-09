import { useTripDetailsQuery } from '@/features/trips/api';
import TripStatusBadge from '@/features/trips/components/TripStatusBadge';
import { A } from '@solidjs/router';
import { IconCar, IconSteeringWheel, IconX } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';
import IconProperty from '../IconProperty';
import { PopoverCloseButton } from '../ui/popover';

export interface MapTripPopoverProps {
  tripId: string;
}

const MapTripPopover: Component<MapTripPopoverProps> = (props) => {
  const trip = useTripDetailsQuery(() => props.tripId);
  const tripLink = () => {
    const projectId = trip.data?.projectId;
    const tripId = props.tripId;

    return `/projects/${projectId}/trip/${tripId}`;
  };
  return (
    <div class='flex flex-col gap-2 text-sm'>
      <div class='flex justify-between gap-4'>
        <A
          href={tripLink()}
          class='font-semibold hover:underline focus:outline-none'
        >
          {trip.data?.project} - Trip {trip.data?.sequenceNumber}
        </A>
        <PopoverCloseButton>
          <IconX class='size-4' />
          <span class='sr-only'>Close</span>
        </PopoverCloseButton>
      </div>
      <div>
        <IconProperty
          icon={IconSteeringWheel}
          text={trip.data?.driver}
          size='xs'
        />
        <div class='flex items-center justify-between gap-4'>
          <IconProperty
            icon={IconCar}
            text={`${trip.data?.vehicleModel ?? ''} ${trip.data?.vehicleRegistrationNumber ?? ''}`}
            size='xs'
          />
          <TripStatusBadge endedAt={trip.data?.endedAt} />
        </div>
      </div>
    </div>
  );
};

export default MapTripPopover;
