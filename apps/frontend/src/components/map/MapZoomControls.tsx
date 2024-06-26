import { cn } from '@/lib/utils';
import { IconMinus, IconPlus } from '@tabler/icons-solidjs';
import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import { useMap } from './MapRoot';

export interface MapZoomControlsProps {
  class?: string;
}

const ZOOM_DELTA = 1;
const ZOOM_DURATION = 300;

const MapZoomControls: Component<MapZoomControlsProps> = (props) => {
  const ctx = useMap();
  const [canZoomIn, setCanZoomIn] = createSignal(
    ctx.map.getView().getZoom() ?? 0 < ctx.map.getView().getMaxZoom()
  );

  const [canZoomOut, setCanZoomOut] = createSignal(
    ctx.map.getView().getZoom() ?? 0 > ctx.map.getView().getMinZoom()
  );

  const zoomIn = () => {
    const currentZoom = ctx.map.getView().getZoom() ?? 0;

    ctx.map
      .getView()
      .animate({ zoom: currentZoom + ZOOM_DELTA, duration: ZOOM_DURATION });
  };

  const zoomOut = () => {
    const currentZoom = ctx.map.getView().getZoom() ?? 0;

    ctx.map
      .getView()
      .animate({ zoom: currentZoom - ZOOM_DELTA, duration: ZOOM_DURATION });
  };

  onMount(() => {
    const onZoom = () => {
      const currentZoom = ctx.map.getView().getZoom() ?? 0;
      setCanZoomIn(currentZoom < ctx.map.getView().getMaxZoom());
      setCanZoomOut(currentZoom > ctx.map.getView().getMinZoom());
    };

    ctx.map.getView().addEventListener('change:resolution', onZoom);

    onCleanup(() => {
      ctx.map.getView().removeEventListener('change:resolution', onZoom);
    });
  });

  return (
    <div
      class={cn(
        'flex flex-col divide-y rounded-md shadow dark:divide-gray-700',
        props.class
      )}
    >
      <button
        disabled={!canZoomIn()}
        class={cn(
          'rounded-t-md border p-1 transition-colors',
          'border-gray-300 bg-gray-50 hover:bg-gray-200 focus:bg-gray-200 disabled:text-gray-400',
          'dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:disabled:text-gray-500'
        )}
        onClick={zoomIn}
      >
        <IconPlus class='h-6 w-6' />
        <span class='sr-only'>Zoom in</span>
      </button>

      <button
        disabled={!canZoomOut()}
        class={cn(
          '-mt-px rounded-b-md border p-1 transition-colors',
          'border-gray-300 bg-gray-50 hover:bg-gray-200 focus:bg-gray-200 disabled:text-gray-400',
          'dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:disabled:text-gray-500'
        )}
        onClick={zoomOut}
      >
        <IconMinus class='h-6 w-6' />
        <span class='sr-only'>Zoom out</span>
      </button>
    </div>
  );
};

export default MapZoomControls;
