import { useTranslations } from '@/features/i18n';
import {
  IconAlertCircleFilled,
  IconMessage,
  IconRulerMeasure,
  IconSteeringWheel,
} from '@tabler/icons-solidjs';
import { cva } from 'class-variance-authority';
import dayjs from 'dayjs';
import { Component } from 'solid-js';
export interface TripCardProps {
  sequenceNumber: number;
  startedAt: string;
  endedAt?: string;
  deviations?: number;
  notes?: number;
  length?: number;
  car?: string;
}

const tripCardVariants = cva('relative overflow-hidden rounded-lg border p-2', {
  variants: {
    status: {
      active: 'border-success-600 bg-success-50 text-success-950',
      inactive: 'border-gray-200 bg-gray-50 text-gray-950',
    },
  },
  defaultVariants: {
    status: 'active',
  },
});

const TripCard: Component<TripCardProps> = (props) => {
  const validEndDate = dayjs(props.endedAt).isValid();
  const tripStatus = validEndDate ? 'inactive' : 'active';
  const { t } = useTranslations();

  return (
    <div class={tripCardVariants({ status: tripStatus })}>
      <div class='flex flex-row items-center gap-2'>
        <p class='text-base font-semibold'>
          {t('TRIPS.TRIP')} {props.sequenceNumber}
        </p>
        <p class='text-sm text-gray-500'>{props.startedAt}</p>
      </div>

      <div class='flex flex-col'>
        <div class='flex flex-row gap-1'>
          <IconSteeringWheel size={20} />
          <p>{props.car}</p>
        </div>

        <div class='flex flex-row gap-1'>
          <IconRulerMeasure size={20} />
          <p>{props.length} km</p>
        </div>
      </div>

      <div class='absolute right-0 top-0 p-2'>
        {validEndDate && (
          <div class='flex flex-row gap-1'>
            <IconAlertCircleFilled size={20} class='text-warning-500' />
            <p class='text-warning-500'>
              {props.deviations} {t('DEVIATIONS.TITLE')}
            </p>
          </div>
        )}

        <div class='flex flex-row justify-end gap-1'>
          <IconMessage size={20} />
          <p>
            {props.notes} {t('NOTES.TITLE')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
