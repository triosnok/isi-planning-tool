import { Component, splitProps } from 'solid-js';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MapMarkerProps } from './MapMarker';
import MapTripPopover from './MapTripPopover';

export interface MapTripPopoverMarkerProps<T extends MapMarkerProps> extends MapMarkerProps {
  as: Component<T>;
  tripId: string;
}

const MapTripPopoverMarker = <T extends MapMarkerProps>(
  props: MapTripPopoverMarkerProps<T> & T
) => {
  const [_, rest] = splitProps(props, ['as', 'tripId']);

  return (
    <Popover>
      <PopoverTrigger
        // @ts-ignore - the component props would need to be overriden head in order for it to work as intended
        as={(triggerProps) => <props.as {...triggerProps} {...rest} />}
      />

      <PopoverContent class='p-1.5'>
        <MapTripPopover tripId={props.tripId} />
      </PopoverContent>
    </Popover>
  );
};

export default MapTripPopoverMarker;
