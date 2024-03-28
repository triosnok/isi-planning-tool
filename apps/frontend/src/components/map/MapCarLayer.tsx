import { Geometry, RoadRailing } from '@isi-insight/client';
import { Component, createEffect, onCleanup } from 'solid-js';
import { parsePoint, useMap } from './MapRoot';
import Leaflet from 'leaflet';

export interface MapCarLayerProps {
  position: Geometry;
  heading: number;
}

const MapCarLayer: Component<MapCarLayerProps> = (props) => {
  const { map } = useMap();

  createEffect(() => {
    const latlng = parsePoint(props.position);
    const positionCircle = Leaflet.circle(latlng, { radius: 200 });

    positionCircle.addTo(map);
    onCleanup(() => positionCircle.removeFrom(map));
  });

  return null;
};

export default MapCarLayer;
