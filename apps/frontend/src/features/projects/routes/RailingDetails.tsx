import IconProperty from '@/components/IconProperty';
import MapRoadSegmentLayer from '@/components/map/MapRoadSegmentLayer';
import BackLink from '@/components/navigation/BackLink';
import { Separator } from '@/components/ui/separator';
import {
  Slider,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from '@/components/ui/slider';
import { NumberFormat, useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { CameraPosition, Range, RoadSegment } from '@isi-insight/client';
import { createScheduled, debounce } from '@solid-primitives/scheduled';
import { useParams, useSearchParams } from '@solidjs/router';
import { IconCalendar, IconCamera } from '@tabler/icons-solidjs';
import {
  Component,
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
} from 'solid-js';
import {
  useRailingCaptureQuery,
  useRailingRoadSegmentsQuery,
} from '../api/railing';

const parseNumber = (value?: string) => {
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
};

const RailingDetails: Component = () => {
  const params = useParams();
  const { n, d } = useTranslations();
  const [searchParams, setSearchParams] = useSearchParams<{
    segment: string;
    cameraPosition: CameraPosition;
    index: string;
    captureId: string;
  }>();

  const [segmentIndexRaw, setSegmentIndex] = createSignal<[number]>([
    parseNumber(searchParams.index) ?? 0,
  ]);

  const selectedSegmentId = () => searchParams.segment;

  const setSelectedSegmentId = (id: string) => {
    setSegmentIndex([0]);
    setSearchParams({ segment: id });
  };

  const selectedSegment = () => {
    const id = selectedSegmentId();
    return segments.data?.find((s) => s.id === id);
  };

  const selectedCaptureId = () => searchParams.captureId;

  const selectedCapture = () => {
    const id = selectedCaptureId();
    return captures.data?.find((c) => c.id === id);
  };

  const setSelectedCaptureId = (id: string) => {
    setSearchParams({ captureId: id });
  };

  const [cameraPosition, setCameraPosition] =
    createSignal<CameraPosition>('TOP');

  const scheduled = createScheduled((fn) => debounce(fn, 700));

  const segmentIndex = () => {
    const values = segmentIndexRaw();
    return values[0];
  };

  const debouncedSegmentIndex = createMemo((p: number = 0) => {
    const idx = segmentIndex();
    return scheduled() ? idx : p;
  });

  // reconciles the segment index to the search params
  // the debounced value is used to prevent the browser from throttling navigation
  createEffect(() => {
    const debouncedIndex = debouncedSegmentIndex();
    setSearchParams({ index: debouncedIndex });
  });

  const railingId = () => {
    const id = params.railingId;
    return parseNumber(id);
  };

  // reset the segment index when the railing changes
  createEffect(() => {
    railingId();
    setSegmentIndex([0]);
  });

  const segments = useRailingRoadSegmentsQuery(railingId);

  const captures = useRailingCaptureQuery(
    railingId,
    selectedSegmentId,
    debouncedSegmentIndex
  );

  const groupedSegments = () => {
    const segs = segments.data;
    const groups: { [k: string]: RoadSegment[] } = {};

    segs?.forEach((seg) => {
      const prefix = seg.roadSystemReference.split(' ').slice(0, 2).join(' ');
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix]!.push(seg);
    });

    return groups;
  };

  const sliderMaxValue = () => selectedSegment()?.length ?? 0;

  return (
    <div class='flex h-full flex-col p-2 max-md:overflow-y-auto md:overflow-hidden'>
      <BackLink href='../..' />

      <h1 class='text-xl font-bold'>Railing {railingId()}</h1>

      <section class='flex gap-1'>
        <For each={Object.entries(groupedSegments())}>
          {([group, segments]) => (
            <div class='flex flex-col'>
              <h2 class='text-sm font-semibold'>{group}</h2>

              <div class='flex gap-1 overflow-x-auto pb-1'>
                <For each={segments}>
                  {(segment) => (
                    <SegmentCard
                      id={segment.roadSystemReference}
                      selected={selectedSegmentId() === segment.id}
                      onClick={() => setSelectedSegmentId(segment.id)}
                    />
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </section>

      <Separator class='my-2' />

      <section class='md:overflow-hidden'>
        <Show when={selectedCapture()}>
          {(capture) => (
            <>
              <h2 class='text-lg font-semibold'>
                [{n(capture().segmentCoverage.start)}-
                {n(capture().segmentCoverage.end)}] - Trip{' '}
                {capture().tripSequenceNumber}
              </h2>
              <IconProperty
                icon={IconCalendar}
                text={`${d(capture().capturedAt)}`}
              />
            </>
          )}
        </Show>

        <div class='mb-4'>
          <ImagePreview
            class='w-full'
            position={cameraPosition()}
            name={selectedCapture()?.imageUrls[cameraPosition()]}
            hidePosition
          />
        </div>

        <div class='mb-2 grid grid-cols-3 gap-1'>
          <ImagePreview
            selected={cameraPosition() === 'TOP'}
            position='TOP'
            name={selectedCapture()?.imageUrls.TOP}
            onClick={() => setCameraPosition('TOP')}
          />
          <ImagePreview
            selected={cameraPosition() === 'LEFT'}
            position='LEFT'
            name={selectedCapture()?.imageUrls.LEFT}
            onClick={() => setCameraPosition('LEFT')}
          />
          <ImagePreview
            selected={cameraPosition() === 'RIGHT'}
            position='RIGHT'
            name={selectedCapture()?.imageUrls.RIGHT}
            onClick={() => setCameraPosition('RIGHT')}
          />
        </div>
      </section>

      <section class='p-2'>
        <Slider
          minValue={0}
          maxValue={sliderMaxValue()}
          disabled={!selectedSegment()}
          value={segmentIndexRaw()}
          step={0.2}
          onChange={setSegmentIndex}
        >
          <SliderTrack />
          <SliderFill />
          <SliderThumb />
        </Slider>

        <div class='my-1 flex items-center justify-between'>
          <span class='flex-1 text-gray-500'>{n(0, NumberFormat.DECIMAL)}</span>
          <span class='flex-1 text-center'>
            {n(segmentIndex(), NumberFormat.DECIMAL)}
          </span>
          <span class='flex-1 text-right text-gray-500'>
            {n(sliderMaxValue(), NumberFormat.DECIMAL)}
          </span>
        </div>

        <div class='flex items-center justify-center gap-2'>
          <SegmentPreviewLegend type='capture-position' />
          <SegmentPreviewLegend type='segment-index' />
        </div>
      </section>

      <section class='-mx-2 flex-1 divide-y divide-gray-300 md:overflow-y-auto dark:divide-gray-800'>
        <For each={captures.data}>
          {(capture) => (
            <CaptureCard
              selected={capture.id === selectedCaptureId()}
              capturedAt={capture.capturedAt}
              segmentCoverage={capture.segmentCoverage}
              tripSequenceNumber={capture.tripSequenceNumber}
              images={capture.imageUrls as any}
              class='w-full'
              onClick={() => setSelectedCaptureId(capture.id)}
            />
          )}
        </For>
      </section>

      <Show when={selectedSegment()}>
        {(segment) => (
          <MapRoadSegmentLayer
            index={segmentIndex()}
            length={segment().length}
            segment={segment().geometry}
            capturePosition={selectedCapture()?.geometry}
          />
        )}
      </Show>
    </div>
  );
};

interface SegmentCardProps {
  id: string;
  selected?: boolean;
  onClick?: () => void;
}

const SegmentCard: Component<SegmentCardProps> = (props) => {
  const shortId = () => {
    const id = props.id;
    return id.split(' ').slice(2).join(' ');
  };
  return (
    <button
      type='button'
      class={cn(
        'flex-shrink-0 rounded-md border border-gray-300 bg-gray-200 px-2 py-1 text-sm dark:border-gray-800 dark:bg-gray-900',
        props.selected &&
          'border-brand-blue-600 bg-brand-blue-50/50 dark:bg-brand-blue-950/50 dark:border-brand-blue-600'
      )}
      onClick={props.onClick}
    >
      {shortId()}
    </button>
  );
};

interface ImagePreviewProps {
  name?: string;
  class?: string;
  hidePosition?: boolean;
  selected?: boolean;
  position: CameraPosition;
  onClick?: () => void;
}

const ImagePreview: Component<ImagePreviewProps> = (props) => {
  return (
    <button
      type='button'
      class={cn(
        'rounded-md border border-transparent p-1',
        props.selected &&
          'border-brand-blue-600 bg-brand-blue-50/50 dark:bg-brand-blue-950/50',
        props.class
      )}
      onClick={props.onClick}
    >
      <div class='flex aspect-video items-center justify-center overflow-hidden rounded-sm border border-gray-300 bg-gray-200 text-sm dark:border-gray-800 dark:bg-gray-900'>
        <span class='truncate text-xs'>
          <Show when={props.name} fallback={'NO IMAGE'}>
            {props.name}
          </Show>
        </span>
      </div>

      <Show when={!props.hidePosition}>
        <p class='text-left text-sm text-gray-700 dark:text-gray-400'>
          {props.position}
        </p>
      </Show>
    </button>
  );
};

interface CaptureCardProps {
  segmentCoverage: Range;
  tripSequenceNumber: number;
  capturedAt: string;
  images: Record<CameraPosition, string>;
  selected?: boolean;
  onClick?: () => void;
  class?: string;
}

const CaptureCard: Component<CaptureCardProps> = (props) => {
  const { t, d, n } = useTranslations();

  const images = () => {
    const keys = Object.keys(props.images) as CameraPosition[];
    return `${keys.length} (${keys.join(', ')})`;
  };

  return (
    <button
      type='button'
      onClick={props.onClick}
      class={cn(
        'flex flex-col p-1 hover:bg-gray-200 dark:hover:bg-gray-900',
        props.selected && 'bg-brand-blue-50/50 dark:bg-brand-blue-950/50',
        props.class
      )}
    >
      <p class='text-lg font-semibold'>
        [{n(props.segmentCoverage.start)}-{n(props.segmentCoverage.end)}] -{' '}
        {t('TRIPS.TRIP')} {props.tripSequenceNumber}
      </p>
      <div class='flex items-center gap-1'>
        <IconProperty icon={IconCalendar} text={d(props.capturedAt)} />
        <IconProperty icon={IconCamera} text={images()} />
      </div>
    </button>
  );
};

interface SegmentPreviewLegendProps {
  type: 'segment-index' | 'capture-position';
}
const SegmentPreviewLegend: Component<SegmentPreviewLegendProps> = (props) => {
  return (
    <div class='flex items-center gap-1 text-sm'>
      <Switch>
        <Match when={props.type === 'segment-index'}>
          <div class='bg-brand-blue-800/50 border-brand-blue size-2 rounded-full border' />
          <span>Segment index</span>
        </Match>
        <Match when={props.type === 'capture-position'}>
          <div class='bg-brand-blue-300/50 border-brand-blue-300 size-2 rounded-full border' />
          <span>Capture position</span>
        </Match>
      </Switch>
    </div>
  );
};

export default RailingDetails;
