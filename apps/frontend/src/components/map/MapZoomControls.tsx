import { cn } from '@/lib/utils';
import { IconMinus, IconPlus } from '@tabler/icons-solidjs';
import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import { useMap } from './MapRoot';

export interface MapZoomControlsProps {
  class?: string;
}

const MapZoomControls: Component<MapZoomControlsProps> = (props) => {
  const ctx = useMap();
  const [canZoomIn, setCanZoomIn] = createSignal(
    ctx.map.getZoom() < ctx.map.getMaxZoom()
  );

  const [canZoomOut, setCanZoomOut] = createSignal(
    ctx.map.getZoom() > ctx.map.getMinZoom()
  );

  const zoomIn = () => ctx.map.zoomIn(1);
  const zoomOut = () => ctx.map.zoomOut(1);

  onMount(() => {
    const onZoom = () => {
      setCanZoomIn(ctx.map.getZoom() < ctx.map.getMaxZoom());
      setCanZoomOut(ctx.map.getZoom() > ctx.map.getMinZoom());
    };

    ctx.map.addEventListener('zoom', onZoom);

    onCleanup(() => {
      ctx.map.removeEventListener('zoom', onZoom);
    });
  });

  return (
    <div class={cn('flex flex-col divide-y rounded-md shadow', props.class)}>
      <button
        disabled={!canZoomIn()}
        class='rounded-t-md border border-gray-300 bg-gray-50 p-1 transition-colors hover:bg-gray-200 focus:bg-gray-200 disabled:text-gray-400'
        onClick={zoomIn}
      >
        <IconPlus class='h-6 w-6' />
        <span class='sr-only'>Zoom in</span>
      </button>

      <button
        disabled={!canZoomOut()}
        class='-mt-px rounded-b-md border border-gray-300 bg-gray-50 p-1 transition-colors hover:bg-gray-200 focus:bg-gray-200 disabled:text-gray-400'
        onClick={zoomOut}
      >
        <IconMinus class='h-6 w-6' />
        <span class='sr-only'>Zoom out</span>
      </button>
    </div>
  );
};

export default MapZoomControls;
