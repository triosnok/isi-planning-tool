import { NumberFormat, useTranslations } from '@/features/i18n';
import { RailingStatus } from '@/lib/constants';
import { IconType, cn, getRailingStatus } from '@/lib/utils';
import { RailingRoadSegments } from '@isi-insight/client';
import {
  IconPhoto,
  IconRulerMeasure,
  IconSquarePercentage,
} from '@tabler/icons-solidjs';
import { cva } from 'class-variance-authority';
import { Component, For, Show } from 'solid-js';
import RoadSign from './RoadSign';

export interface RailingCardProps {
  id: number;
  length: number;
  capturedAt?: string;
  captureGrade: number;
  roads: RailingRoadSegments[];
  onClick?: () => void;
  class?: string;
}

const railingCardVariants = cva(
  'flex justify-between border rounded-md border-gray-300 dark:border-gray-900 p-2 hover:bg-gray-100 dark:hover:bg-gray-900',
  {
    variants: {
      status: {
        [RailingStatus.TODO]: [''],
        [RailingStatus.ERROR]: [
          'border-error-600 dark:border-error-600 dark:bg-error-950/50 dark:hover:bg-error-950',
        ],
        [RailingStatus.OK]: [
          'border-success-600 dark:border-sucess-600 dark:bg-success-950/50 bg-success-100 dark:hover:bg-success-950',
        ],
      },
    },
  }
);

const RailingCard: Component<RailingCardProps> = (props) => {
  const { d, n } = useTranslations();
  const status = getRailingStatus(props.captureGrade);

  return (
    <button
      type='button'
      onClick={props.onClick}
      class={cn(railingCardVariants({ status }), props.class)}
    >
      <div>
        <h3 class='text-lg font-semibold'>{props.id}</h3>

        <For each={props.roads}>
          {(road) => <RoadSign type={road.category} name={road.reference} />}
        </For>
      </div>

      <div class='flex flex-col gap-0.5'>
        <CardDetail icon={IconRulerMeasure} text={`${n(props.length)} m`} />

        <CardDetail
          icon={IconSquarePercentage}
          text={n(props.captureGrade, NumberFormat.PERCENTAGE)}
        />

        <Show when={props.capturedAt}>
          <CardDetail icon={IconPhoto} text={d(props.capturedAt)} />
        </Show>
      </div>
    </button>
  );
};

const CardDetail: Component<{ icon: IconType; text: string }> = (props) => {
  return (
    <div class='flex items-center justify-end gap-1'>
      <span class='text-xs dark:text-gray-100'>{props.text}</span>
      <props.icon class='size-4 text-gray-400 dark:text-gray-500' />
    </div>
  );
};

export default RailingCard;
