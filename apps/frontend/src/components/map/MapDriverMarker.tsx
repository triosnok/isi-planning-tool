import { Geometry } from '@isi-insight/client';
import { Component, splitProps } from 'solid-js';
import MapMarker, { MapMarkerProps } from './MapMarker';
import { Ref } from '@solid-primitives/refs';

export interface MapDriverMarkerProps extends MapMarkerProps {
  fullName: string;
}

const MapDriverMarker: Component<MapDriverMarkerProps> = (props) => {
  const [_, rest] = splitProps(props, ['fullName']);
  const initials = () => {
    const name = props.fullName;
    const names = name
      .split(' ')
      .map((n) => n.trim().charAt(0))
      .slice(0, 2);
    return names.join('');
  };

  return (
    <MapMarker {...rest}>
      <div class='w-5 text-center text-sm font-semibold text-gray-50'>
        {initials()}
      </div>
    </MapMarker>
  );
};

export default MapDriverMarker;
