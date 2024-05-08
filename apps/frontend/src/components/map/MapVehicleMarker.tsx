import { IconCar } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';
import MapMarker, { MapMarkerProps } from './MapMarker';

export interface MapVehicleMarkerProps extends MapMarkerProps {}

const MapVehicleMarker: Component<MapVehicleMarkerProps> = (props) => {
  return (
    <MapMarker {...props}>
      <IconCar class='size-4 text-gray-50' />
    </MapMarker>
  );
};

export default MapVehicleMarker;
