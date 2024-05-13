import { cn } from '@/lib/utils';
import { Geometry as InternalGeometry } from '@isi-insight/client';
import { Ref, mergeRefs } from '@solid-primitives/refs';
import { debounce } from '@solid-primitives/scheduled';
import { Overlay } from 'ol';
import { linear } from 'ol/easing';
import { Point } from 'ol/geom';
import { toRadians } from 'ol/math';
import {
  Component,
  ComponentProps,
  JSX,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js';
import { useMap } from './MapRoot';
import { parseFeature, parseGeometry } from './utils';

export interface MapMarkerProps extends Omit<ComponentProps<'button'>, 'ref'> {
  children?: JSX.Element;
  class?: string;
  position: InternalGeometry;
  ref?: Ref<HTMLButtonElement | null>;
  onClick?: () => void;
  heading?: number;
  follow?: boolean;
}

const TRANSITION_CLASSES = ['transition-transform', 'duration-1000'];

const EASED_TRANSITION_CLASSES = [...TRANSITION_CLASSES, 'ease-linear'];

const MapMarker: Component<MapMarkerProps> = (props) => {
  const ctx = useMap();
  const [carOverlay, setCarOverlay] = createSignal<Overlay>();
  const [_, rest] = splitProps(props, [
    'ref',
    'class',
    'position',
    'heading',
    'follow',
    'children',
  ]);

  let overlayElement: HTMLButtonElement;

  const transform = () => {
    const angle = props.heading;
    if (ctx.follow()) return undefined;
    return `rotate(${angle ?? 0}deg)`;
  };

  onMount(() => {
    const pos = parseFeature<Point>(props.position);

    const over = new Overlay({
      element: overlayElement,
      positioning: 'center-center',
      className: ctx.follow()
        ? TRANSITION_CLASSES.join(' ')
        : 'transition-transform duration-1000',
      stopEvent: false,
      position: pos.getGeometry()?.getCoordinates(),
    });

    setCarOverlay(over);

    ctx.map.addOverlay(over);

    const disableTransition = () => {
      carOverlay()
        ?.getElement()
        ?.parentElement?.classList.remove(...EASED_TRANSITION_CLASSES);
    };

    const enableTransition = () => {
      carOverlay()
        ?.getElement()
        ?.parentElement?.classList.add(...EASED_TRANSITION_CLASSES);
    };

    const debouncedReenable = debounce(enableTransition, 200);

    const disableOnResize = () => {
      disableTransition();
      debouncedReenable();
    };

    ctx.map.addEventListener('movestart', disableTransition);
    ctx.map.addEventListener('moveend', enableTransition);
    ctx.map.addChangeListener('size', disableOnResize);
    ctx.map.getView().addChangeListener('resolution', disableOnResize);

    onCleanup(() => {
      ctx.map.removeOverlay(over);
      ctx.map.removeEventListener('movestart', disableTransition);
      ctx.map.removeEventListener('moveend', enableTransition);
      ctx.map.removeChangeListener('size', disableOnResize);
      ctx.map.getView().removeChangeListener('resolution', disableOnResize);
    });
  });

  createEffect(() => {
    const following = ctx.follow();
    const overlay = carOverlay();

    if (following) {
      ctx.map.getView().animate({ zoom: 14, duration: 1000 });

      overlay?.getElement()?.parentElement?.classList.remove('ease-linear');
    } else {
      overlay
        ?.getElement()
        ?.parentElement?.classList.add(...EASED_TRANSITION_CLASSES);
    }
  });

  createEffect(() => {
    const wkt = parseGeometry<Point>(props.position);
    const rotationAngle = props.heading;
    const overlay = carOverlay();
    if (overlay === undefined) return;

    overlay.setPosition(wkt.getCoordinates());

    if (ctx.follow()) {
      ctx.map.getView().animate({
        easing: linear,
        center: wkt.getCoordinates(),
        duration: 1000,
        rotation: -toRadians(rotationAngle ?? 0),
      });
    } else {
      ctx.map.getView().animate({ rotation: 0, duration: 1000 });
    }
  });

  return (
    <div class='hidden'>
      <button
        type='button'
        ref={mergeRefs(props.ref, (el) => (overlayElement = el!))}
        class={cn(
          'bg-brand-blue border-brand-blue-300 relative rounded-full border p-1',
          props.ref === undefined &&
            props.onClick === undefined &&
            'cursor-default'
        )}
        {...rest}
      >
        <div class={props.class}>{props.children}</div>

        <Show when={props.heading !== undefined}>
          <div class='absolute left-1/2 top-1/2 flex h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2'>
            <div
              class='flex h-full w-full items-start justify-center transition-transform duration-1000 ease-linear'
              style={{
                transform: transform(),
              }}
            >
              <div class='border-b-brand-blue-300 relative overflow-hidden border border-x-[10px] border-b-[10px] border-t-0 border-x-transparent' />
            </div>
          </div>
        </Show>
      </button>
    </div>
  );
};

export default MapMarker;
