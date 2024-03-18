import { RoadRailing } from '@isi-insight/client';
import Leaflet from 'leaflet';
import { Component, createEffect, onCleanup } from 'solid-js';
import { parse, useMap } from './MapRoot';
import 'leaflet-textpath';

export interface MapRailingLayerProps {
  railings?: RoadRailing[];
}

const MapRailingLayer: Component<MapRailingLayerProps> = (props) => {
  const { map } = useMap();

  const getRailingColor = (completionGrade: number) => {
    if (completionGrade === 0) return 'blue';
    else if (completionGrade > 0 && completionGrade < 95) return 'red';
    else if (completionGrade >= 95 && completionGrade <= 100) return 'green';
    else return 'gray';
  };

  createEffect(() => {
    const polylines = props.railings?.map((railing) => {
      const ls = parse(railing.geometry.wkt);
      const line = Leaflet.polyline(ls, {
        color: getRailingColor(railing.captureGrade),
        weight: 4,
        opacity: 1,
        smoothFactor: 1,
      });

      line.setText('  ►  ', {
        repeat: true,
        center: true,
        offset: 10,
        attributes: { fill: getRailingColor(railing.captureGrade)! },
      });

      return line;
    });

    const lg = Leaflet.layerGroup(polylines);

    lg.addTo(map);
    onCleanup(() => lg.removeFrom(map));
  });

  return null;
};

export default MapRailingLayer;
