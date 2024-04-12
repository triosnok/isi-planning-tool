import { Geometry as InternalGeometry } from '@isi-insight/client';
import { Feature } from 'ol';
import WKT from 'ol/format/WKT';
import { Geometry, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { useMap } from './MapRoot';

export interface MapCarLayerProps {
  position: InternalGeometry;
  heading: number;
}

const READ_OPTIONS = {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:25833',
};

const fmt = new WKT();

const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

const MapCarLayer: Component<MapCarLayerProps> = (props) => {
  const { map } = useMap();
  const [carCircle, setCarCircle] = createSignal<Feature<Geometry>>();
  const [carIcon, setCarIcon] = createSignal<Icon>();

  onMount(() => {
    const pos = fmt.readFeature(props.position.wkt, READ_OPTIONS);

    const icon = new Icon({
      anchor: [0.5, 38.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: '/car.png',
      scale: 0.5,
      rotation: toRadians(props.heading),
    });

    pos.setStyle(
      new Style({
        image: icon,
      })
    );

    setCarCircle(pos);
    setCarIcon(icon);

    const l = new VectorLayer({
      source: new VectorSource({ features: [pos] }),
    });

    map.addLayer(l);

    onCleanup(() => map.removeLayer(l));
  });

  createEffect(() => {
    const wkt = fmt.readGeometry(props.position.wkt, READ_OPTIONS) as Point;
    const circle = carCircle();
    const icon = carIcon();

    if (circle) circle.setGeometry(wkt);
    if (icon) icon.setRotation(toRadians(props.heading));
  });

  return null;
};

export default MapCarLayer;
