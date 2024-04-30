import { useTranslations } from '@/features/i18n';
import {
  IconAlertCircleFilled,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from '@tabler/icons-solidjs';
import { cva } from 'class-variance-authority';
import { Component, For, Match, Switch } from 'solid-js';

import { ImageAnalysis } from '@isi-insight/client';
import ImagePositionStatus from './ImagePositionStatus';

export interface ImageSummaryProps {
  analysis: ImageAnalysis;
}

const ImageSummary: Component<ImageSummaryProps> = (props) => {
  const { t } = useTranslations();

  const tripSummaryVariants = cva(
    'relative overflow-hidden rounded-lg border p-2 justify-between',
    {
      variants: {
        status: {
          OK: 'border-success-600 bg-success-50 text-success-950 dark:bg-success-950/25 dark:text-success-50',
          OUT_OF_TOLERANCE:
            'border-error-600 bg-error-50 dark:bg-error-950/25 dark:border-error-800',
          WITHIN_TOLERANCE:
            'border-warning-600 bg-warning-50 dark:bg-warning-950/25 dark:border-warning-800',
        },
      },
      defaultVariants: {
        status: 'OK',
      },
    }
  );

  return (
    <div class={tripSummaryVariants({ status: props.analysis.overall })}>
      <div class='flex flex-row justify-between pb-2'>
        <p class='max-w-full self-center truncate font-medium'>
          {t('TRIPS.TRIP_SUMMARY.AMOUNT_OF_IMAGES_TAKEN')}
        </p>

        <Switch>
          <Match when={props.analysis.overall === 'OK'}>
            <IconCircleCheckFilled class='text-success-600 size-5' />
          </Match>
          <Match when={props.analysis.overall === 'OUT_OF_TOLERANCE'}>
            <IconCircleXFilled class='text-error-600 size-5' />
          </Match>
          <Match when={props.analysis.overall === 'WITHIN_TOLERANCE'}>
            <IconAlertCircleFilled class='text-warning-600 size-5' />
          </Match>
        </Switch>
      </div>

      <ImagePositionStatus
        position='LEFT'
        count={props.analysis.positions.LEFT?.count}
        status={props.analysis.positions.LEFT?.status}
      />

      <ImagePositionStatus
        position='RIGHT'
        count={props.analysis.positions.RIGHT?.count}
        status={props.analysis.positions.RIGHT?.status}
      />

      <ImagePositionStatus
        position='TOP'
        count={props.analysis.positions.TOP?.count}
        status={props.analysis.positions.TOP?.status}
      />

      <ul class='text-error-500 mt-2 list-inside list-disc text-sm'>
        <For each={props.analysis.remarks}>
          {(remark) => (
            <li>
              <span class='-ml-2'>
                {t(`TRIPS.TRIP_SUMMARY.REMARKS.${remark}`)}
              </span>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default ImageSummary;
