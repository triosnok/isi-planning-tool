import { Geometry } from '@isi-insight/client';
import { Feature } from 'ol';
import WKT from 'ol/format/WKT';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { useMap } from './MapRoot';

export interface MapCarLayerProps {
  position: Geometry;
  heading: number;
}

const fmt = new WKT();

const MapCarLayer: Component<MapCarLayerProps> = (props) => {
  const { map } = useMap();
  const [carCircle, setCarCircle] = createSignal<Feature<Point>>();

  onMount(() => {
    const pos = fmt.readFeature(props.position.wkt);

    const l = new VectorLayer({
      source: new VectorSource({ features: [pos] }),
    });

    map.addLayer(l);
    setCarCircle(pos as any);

    onCleanup(() => map.removeLayer(l));
  });

  createEffect(() => {
    const wkt = fmt.readGeometry(props.position.wkt) as Point;
    const circle = carCircle();
    if (circle) circle.setGeometry(wkt);
  });

  return null;
};

export default MapCarLayer;
