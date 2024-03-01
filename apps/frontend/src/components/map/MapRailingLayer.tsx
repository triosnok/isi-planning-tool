import { RoadRailing } from '@isi-insight/client';
import Leaflet from 'leaflet';
import { Component, createEffect, onCleanup } from 'solid-js';
import { parse, useMap } from './MapRoot';

export interface MapRailingLayerProps {
  railings?: RoadRailing[];
}

const MapRailingLayer: Component<MapRailingLayerProps> = (props) => {
  const { map } = useMap();

  createEffect(() => {
    const polylines = props.railings?.map((railing) => {
      const ls = parse(railing.wkt);
      return Leaflet.polyline(ls, {
        color: 'blue',
        weight: 8,
        opacity: 1,
        smoothFactor: 1,
      });
    });

    const lg = Leaflet.layerGroup(polylines);

    lg.addTo(map);
    onCleanup(() => lg.removeFrom(map));
  });

  return null;
};

export default MapRailingLayer;
