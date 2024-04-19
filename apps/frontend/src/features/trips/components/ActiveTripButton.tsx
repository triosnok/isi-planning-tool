import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { A } from '@solidjs/router';
import { IconCar } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface ActiveTripButtonProps {
  tripId: string;
  projectId: string;
}

export const ActiveTripButton: Component<ActiveTripButtonProps> = (props) => {
  const { t } = useTranslations();

  return (
    <A
      href={`/projects/${props.projectId}/trip/${props.tripId}`}
      class={cn(
        'border-brand-blue-300 to-brand-blue-700 via-brand-blue-300 ',
        'from-brand-blue-600 bg-size-200 hover:bg-pos-100',
        'flex min-w-44 justify-center gap-2 rounded-sm border-2 text-white sm:px-1',
        'bg-gradient-to-br py-0.5 transition-all duration-500'
      )}
    >
      <IconCar class='size-6' />
      <span>{t('TRIPS.GO_TO_ACTIVE_TRIP')}</span>
    </A>
  );
};

export default ActiveTripButton;
