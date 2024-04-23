import { Geometry as InternalGeometry } from '@isi-insight/client';
import { IconCar } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';
import MapMarker from './MapMarker';

export interface MapCarLayerProps {
  position: InternalGeometry;
  heading: number;
}

const MapCarLayer: Component<MapCarLayerProps> = (props) => {
  return (
    <MapMarker position={props.position} heading={props.heading}>
      <IconCar class='size-4 text-gray-50' />
    </MapMarker>
  );
};

export default MapCarLayer;
