import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { IconCar, IconPencil, IconPoint } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface PlanCardProps {
  startsAt: string;
  endsAt: string;
  railingAmount: number;
  length: number;
  car: string;
  ongoingTripAmount: number;
  selected?: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
}

const PlanCard: Component<PlanCardProps> = (props) => {
  const { t } = useTranslations();

  return (
    <div
      onClick={props.onToggle}
      class={cn(
        'select-none overflow-hidden rounded-lg border transition-colors hover:cursor-pointer hover:bg-gray-100',
        props.selected &&
          'border-brand-blue-500 bg-brand-blue-50/40 hover:bg-brand-blue-50/80'
      )}
    >
      <div class='flex justify-between p-2'>
        <div class='flex items-center'>
          <div
            role='figure'
            class={cn(
              'mr-2 h-2 w-2 rounded-full border-2 border-gray-400',
              props.selected && 'bg-brand-blue border-brand-blue'
            )}
          />

          <div class='flex flex-col'>
            <p
              class={cn(
                props.ongoingTripAmount === 0 && 'hidden',
                'text-success-700 text-xs'
              )}
            >
              {props.ongoingTripAmount} {t('TRIPS.ONGOING_TRIPS')}
            </p>
            <h3 class='text-xl font-semibold'>
              {props.startsAt} - {props.endsAt}
            </h3>
            <div class='flex items-center gap-1 text-gray-800'>
              <IconCar class='h-5 w-5' />
              <p>{props.car}</p>
            </div>
          </div>
        </div>

        <div class='flex flex-col items-end'>
          <IconPencil class='h-5 w-5' />

          <p>
            {props.railingAmount} {t('RAILINGS.TITLE')}
          </p>
          <p>{props.length} m</p>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
