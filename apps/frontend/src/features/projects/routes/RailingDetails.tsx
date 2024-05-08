import BackLink from '@/components/navigation/BackLink';
import {
  Slider,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from '@/components/ui/slider';
import { NumberFormat, useTranslations } from '@/features/i18n';
import { IconType, cn } from '@/lib/utils';
import {
  CameraPosition,
  RailingCapture,
  Range,
  RoadSegment,
} from '@isi-insight/client';
import { createScheduled, debounce } from '@solid-primitives/scheduled';
import { useParams } from '@solidjs/router';
import { IconCalendar, IconCamera } from '@tabler/icons-solidjs';
import { Component, For, Show, createMemo, createSignal } from 'solid-js';
import {
  useRailingCaptureQuery,
  useRailingRoadSegmentsQuery,
} from '../api/railing';
import IconProperty from '@/components/IconProperty';

const RailingDetails: Component = () => {
  const params = useParams();
  const { n } = useTranslations();
  const [selectedSegment, setSelectedSegment] = createSignal<RoadSegment>();
  const [selectedCapture, setSelectedCapture] = createSignal<RailingCapture>();
  const [cameraPosition, setCameraPosition] =
    createSignal<CameraPosition>('TOP');
  const [segmentIndex, setSegmentIndex] = createSignal(0);
  const scheduled = createScheduled((fn) => debounce(fn, 700));
  const debouncedSegmentIndex = createMemo((p: number = 0) => {
    return scheduled() ? segmentIndex() : p;
  });

  const railingId = () => {
    const id = params.railingId;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return undefined;
    return numericId;
  };

  const segments = useRailingRoadSegmentsQuery(railingId);

  const captures = useRailingCaptureQuery(
    railingId,
    () => selectedSegment()?.id,
    debouncedSegmentIndex
  );

  const sliderMaxValue = () => selectedSegment()?.length ?? 0;

  return (
    <div class='flex h-full flex-col overflow-hidden p-2'>
      <BackLink href='../..' />

      <h1 class='text-xl font-bold'>Railing {railingId()}</h1>

      <section>
        <For each={segments.data}>
          {(segment) => (
            <SegmentCard
              id={segment.roadSystemReference}
              selected={selectedSegment()?.id === segment.id}
              onClick={() => setSelectedSegment(segment)}
            />
          )}
        </For>
      </section>

      <section class='mt-2 overflow-hidden'>
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
      </section>

      <section class='flex-1 divide-y divide-gray-300 overflow-y-auto dark:divide-gray-800'>
        <For each={captures.data}>
          {(capture) => (
            <CaptureCard
              capturedAt={capture.capturedAt}
              segmentCoverage={capture.segmentCoverage}
              tripSequenceNumber={capture.tripSequenceNumber}
              images={capture.imageUrls as any}
              class='w-full'
              onClick={() => setSelectedCapture(capture)}
            />
          )}
        </For>
      </section>
    </div>
  );
};

interface SegmentCardProps {
  id: string;
  selected?: boolean;
  onClick?: () => void;
}

const SegmentCard: Component<SegmentCardProps> = (props) => {
  return (
    <button
      type='button'
      class={cn(
        'rounded-md border border-gray-400 bg-gray-300 px-2 py-1 text-sm dark:border-gray-800 dark:bg-gray-900',
        props.selected &&
          'border-brand-blue-600 bg-brand-blue-50/50 dark:bg-brand-blue-950/50 dark:border-brand-blue-600'
      )}
      onClick={props.onClick}
    >
      {props.id}
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
      <div class='flex aspect-video items-center justify-center overflow-hidden rounded-sm border border-gray-400 bg-gray-300 text-sm dark:border-gray-800 dark:bg-gray-900'>
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
        props.class
      )}
    >
      <p class='text-lg font-semibold'>
        [{n(props.segmentCoverage.start)}-{n(props.segmentCoverage.end)}] - {t('TRIPS.TRIP')} {props.tripSequenceNumber}
      </p>
      <div class='flex items-center gap-1'>
        <IconProperty icon={IconCalendar} text={d(props.capturedAt)} />
        <IconProperty icon={IconCamera} text={images()} />
      </div>
    </button>
  );
};

export default RailingDetails;
