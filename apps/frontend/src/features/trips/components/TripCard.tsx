import { useTranslations } from '@/features/i18n';
import {
  IconAlertCircleFilled,
  IconMessage,
  IconRulerMeasure,
  IconSteeringWheel,
} from '@tabler/icons-solidjs';
import { cva } from 'class-variance-authority';
import dayjs from 'dayjs';
import { Component, Show } from 'solid-js';
export interface TripCardProps {
  sequenceNumber: number;
  startedAt: string;
  endedAt?: string;
  deviations?: number;
  notes?: number;
  length?: number;
  car?: string;
  status?: 'active' | 'inactive' | 'dashboard';
}

const tripCardVariants = cva(
  'relative transition-colors hover:cursor-pointer overflow-hidden rounded-lg border p-2',
  {
    variants: {
      status: {
        active:
          'border-success-600 hover:bg-success-100 dark:hover:bg-success-900 bg-success-50 text-success-950 dark:bg-success-950 dark:text-success-50',
        inactive:
          'border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 bg-gray-50 dark:bg-gray-950 dark:border-gray-800',
        dashboard:
          'border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900 bg-gray-50 dark:bg-gray-950 dark:border-gray-800',
      },
    },
    defaultVariants: {
      status: 'active',
    },
  }
);

const TripCard: Component<TripCardProps> = (props) => {
  const validEndDate = dayjs(props.endedAt).isValid();

  const tripStatus = () => {
    if (props.status) return props.status;
    else return validEndDate ? 'inactive' : 'active';
  };

  const { t } = useTranslations();

  return (
    <div class={tripCardVariants({ status: tripStatus() })}>
      <div class='flex flex-row items-center gap-2'>
        <p class='text-base font-semibold'>
          {t('TRIPS.TRIP')} {props.sequenceNumber}
        </p>
        <p class='text-sm text-gray-500 dark:text-gray-400'>
          {props.startedAt}
        </p>
      </div>

      <div class='flex flex-col'>
        <div class='flex flex-row gap-1'>
          <IconSteeringWheel class='size-5' />
          <p>{props.car}</p>
        </div>

        <div class='flex flex-row gap-1'>
          <IconRulerMeasure class='size-5' />
          <p>{props.length} km</p>
        </div>
      </div>

      <div class='absolute right-0 top-0 p-2'>
        <Show when={validEndDate && props.deviations}>
          <div class='flex flex-row gap-1'>
            <IconAlertCircleFilled class='text-warning-500 size-5' />
            <p class='text-warning-500'>
              {props.deviations} {t('DEVIATIONS.TITLE')}
            </p>
          </div>
        </Show>
        <Show when={props.notes}>
          <div class='flex flex-row justify-end gap-1'>
            <IconMessage class='size-5' />
            <p>
              {props.notes} {t('NOTES.TITLE')}
            </p>
          </div>
        </Show>
      </div>
    </div>
  );
};

export default TripCard;
