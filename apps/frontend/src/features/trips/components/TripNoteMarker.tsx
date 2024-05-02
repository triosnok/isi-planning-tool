import { useMap } from '@/components/map/MapRoot';
import { cn } from '@/lib/utils';
import { TripNoteDetails } from '@isi-insight/client';
import { IconMessage } from '@tabler/icons-solidjs';
import { Feature, Overlay } from 'ol';
import WKT from 'ol/format/WKT';
import { Point } from 'ol/geom';
import { Component, createSignal, onCleanup, onMount } from 'solid-js';

export interface TripNoteMarkerProps {
  note?: TripNoteDetails;
  onSelected?: () => void;
  selected: boolean;
}

const fmt = new WKT();

const READ_OPTIONS = {
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:25833',
};

const TripNoteMarker: Component<TripNoteMarkerProps> = (props) => {
  let overlayElement: HTMLDivElement;

  const ctx = useMap();

  onMount(() => {
    if (props.note?.geometry === undefined || props.note.geometry === null) {
      return;
    }

    const pos = fmt.readFeature(
      props.note.geometry.wkt,
      READ_OPTIONS
    ) as Feature<Point>;

    const over = new Overlay({
      element: overlayElement,
      positioning: 'bottom-center',
      position: pos.getGeometry()?.getCoordinates(),
    });

    ctx.map.addOverlay(over);

    onCleanup(() => {
      ctx.map.removeOverlay(over);
    });
  });

  return (
    <div class='hidden'>
      <div
        ref={overlayElement!}
        class='group isolate flex flex-col items-center justify-center'
      >
        <button
          onClick={props.onSelected}
          class={cn(
            'z-20 flex flex-col overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-950 p-1 hover:bg-gray-800 dark:border-gray-300 dark:bg-gray-50 dark:hover:bg-gray-200',
            props.selected &&
              'bg-brand-blue-800 border-brand-blue-700 group-hover:bg-brand-blue-900 dark:bg-brand-blue-100 dark:border-brand-blue-300 dark:group-hover:bg-brand-blue-200'
          )}
        >
          <IconMessage class='size-6 text-gray-50 dark:text-gray-950' />
        </button>

        <div
          class={cn(
            'z-20 -mt-1 h-1 w-[17px] bg-gray-950 group-hover:bg-gray-800 dark:bg-gray-50 dark:group-hover:bg-gray-200',
            props.selected &&
              'bg-brand-blue-800 border-brand-blue-700 group-hover:bg-brand-blue-900 dark:bg-brand-blue-100 dark:border-brand-blue-300 dark:group-hover:bg-brand-blue-200'
          )}
        />
        <div
          class={cn(
            '-mt-2 h-4 w-4 rotate-45 border-b-2 border-r-2 border-gray-700 bg-gray-950 group-hover:bg-gray-800 dark:border-gray-300 dark:bg-gray-50 dark:group-hover:bg-gray-200',
            props.selected &&
              'bg-brand-blue-800 border-brand-blue-700 group-hover:bg-brand-blue-900 dark:bg-brand-blue-100 dark:border-brand-blue-300 dark:group-hover:bg-brand-blue-200'
          )}
        />
      </div>
    </div>
  );
};

export default TripNoteMarker;
