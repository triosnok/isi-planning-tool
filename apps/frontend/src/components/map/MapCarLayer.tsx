import { Geometry } from '@isi-insight/client';
import Leaflet from 'leaflet';
import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { parsePoint, useMap } from './MapRoot';

export interface MapCarLayerProps {
  position: Geometry;
  heading: number;
}

const MapCarLayer: Component<MapCarLayerProps> = (props) => {
  const { map } = useMap();
  const [carCircle, setCarCircle] = createSignal<Leaflet.Circle>();

  onMount(() => {
    const latlng = parsePoint(props.position);
    const carCircle = Leaflet.circle(latlng, { radius: 10 });

    carCircle.addTo(map);
    setCarCircle(carCircle);

    onCleanup(() => carCircle.removeFrom(map));
  });

  createEffect(() => {
    const latlng = parsePoint(props.position);
    const circle = carCircle();
    if (circle) circle.setLatLng(latlng);
  });

  return null;
};

export default MapCarLayer;
