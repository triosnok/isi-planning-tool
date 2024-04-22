import { Geometry } from '@isi-insight/client';
import { Component } from 'solid-js';
import MapMarker from './MapMarker';

export interface MapDriverLayerProps {
  position: Geometry;
  heading: number;
  fullName: string;
}

const MapDriverLayer: Component<MapDriverLayerProps> = (props) => {
  const initials = () => {
    const name = props.fullName;
    const names = name
      .split(' ')
      .map((n) => n.trim().charAt(0))
      .slice(0, 2);
    return names.join('');
  };

  return (
    <MapMarker position={props.position} heading={props.heading}>
      <div class='text-sm font-semibold'>{initials()}</div>
    </MapMarker>
  );
};

export default MapDriverLayer;
