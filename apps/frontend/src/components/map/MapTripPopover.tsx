import { useTripDetailsQuery } from '@/features/trips/api';
import { Component } from 'solid-js';

export interface MapTripPopoverProps {
  tripId: string;
}

const MapTripPopover: Component<MapTripPopoverProps> = (props) => {
  const trip = useTripDetailsQuery(() => props.tripId);
  return <div>{trip.data?.driver}</div>;
};

export default MapTripPopover;
