import { Geometry as InternalGeometry } from '@isi-insight/client';
import { IconCar } from '@tabler/icons-solidjs';
import { Feature, Overlay } from 'ol';
import WKT from 'ol/format/WKT';
import { Point } from 'ol/geom';
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

const MapCarLayer: Component<MapCarLayerProps> = (props) => {
  const { map } = useMap();
  const [carOverlay, setCarOverlay] = createSignal<Overlay>();
  let overlayElement: HTMLDivElement;

  const transform = () => {
    const angle = props.heading;
    return `rotate(${angle}deg)`;
  };

  onMount(() => {
    const pos = fmt.readFeature(
      props.position.wkt,
      READ_OPTIONS
    ) as Feature<Point>;

    const over = new Overlay({
      element: overlayElement,
      positioning: 'center-center',
      stopEvent: false,
      position: pos.getGeometry()?.getCoordinates(),
    });

    setCarOverlay(over);

    map.addOverlay(over);

    onCleanup(() => {
      map.removeOverlay(over);
    });
  });

  createEffect(() => {
    const wkt = fmt.readGeometry(props.position.wkt, READ_OPTIONS) as Point;
    const overlay = carOverlay();

    if (overlay) overlay.setPosition(wkt.getCoordinates());
  });

  return (
    <div class='hidden'>
      <div
        ref={overlayElement!}
        class='bg-brand-blue border-brand-blue-300 relative rounded-full border p-1'
      >
        <IconCar class='size-4 text-gray-50' />

        <div class='absolute left-1/2 top-1/2 flex h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2'>
          <div
            class='flex h-full w-full items-start justify-center'
            style={{
              transform: transform(),
            }}
          >
            <div class='border-b-brand-blue-600 border border-x-[10px] border-b-[10px] border-t-0 border-x-transparent' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapCarLayer;
