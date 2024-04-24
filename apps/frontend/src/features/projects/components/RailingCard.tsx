import { NumberFormat, useTranslations } from '@/features/i18n';
import { IconType } from '@/lib/utils';
import { RailingRoadSegments } from '@isi-insight/client';
import {
  IconPhoto,
  IconRulerMeasure,
  IconSquarePercentage,
} from '@tabler/icons-solidjs';
import { Component, For, Show } from 'solid-js';
import RoadSign from './RoadSign';

export interface RailingCardProps {
  id: number;
  length: number;
  capturedAt?: string;
  captureGrade: number;
  roads: RailingRoadSegments[];
}

const RailingCard: Component<RailingCardProps> = (props) => {
  const { d, n } = useTranslations();

  return (
    <div class='flex justify-between rounded-md border border-gray-900 p-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900'>
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
    </div>
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
