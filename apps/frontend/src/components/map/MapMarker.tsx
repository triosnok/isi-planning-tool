import { Geometry as InternalGeometry } from '@isi-insight/client';
import { Feature, Overlay } from 'ol';
import WKT from 'ol/format/WKT';
import { Point } from 'ol/geom';
import {
  Component,
  JSX,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { useMap } from './MapRoot';

export interface MapMarkerProps {
  children?: JSX.Element;
  class?: string;
  position: InternalGeometry;
  heading?: number;
}

const fmt = new WKT();

const READ_OPTIONS = {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:25833',
};

const MapMarker: Component<MapMarkerProps> = (props) => {
  const { map } = useMap();
  const [carOverlay, setCarOverlay] = createSignal<Overlay>();
  let overlayElement: HTMLDivElement;

  const transform = () => {
    const angle = props.heading;
    return `rotate(${angle ?? 0}deg)`;
  };

  onMount(() => {
    const pos = fmt.readFeature(
      props.position.wkt,
      READ_OPTIONS
    ) as Feature<Point>;

    const over = new Overlay({
      element: overlayElement,
      positioning: 'center-center',
      className: 'transition-all',
      stopEvent: false,
      position: pos.getGeometry()?.getCoordinates(),
    });

    setCarOverlay(over);

    map.addOverlay(over);

    const onMoveStart = () =>
      over.getElement()?.parentElement?.classList.remove('transition-all');
    const onMoveEnd = () =>
      over.getElement()?.parentElement?.classList.add('transition-all');

    map.addEventListener('movestart', onMoveStart);
    map.addEventListener('moveend', onMoveEnd);

    onCleanup(() => {
      map.removeOverlay(over);
      map.removeEventListener('movestart', onMoveStart);
      map.removeEventListener('moveend', onMoveEnd);
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
        <div class={props.class}>{props.children}</div>

        <Show when={props.heading !== undefined}>
          <div class='absolute left-1/2 top-1/2 flex h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2'>
            <div
              class='flex h-full w-full items-start justify-center transition-transform'
              style={{
                transform: transform(),
              }}
            >
              <div class='border-b-brand-blue-300 relative overflow-hidden border border-x-[10px] border-b-[10px] border-t-0 border-x-transparent' />
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default MapMarker;
