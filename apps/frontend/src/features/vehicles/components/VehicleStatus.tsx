import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
} from '@tabler/icons-solidjs';
import { Component, Show } from 'solid-js';

export interface VehicleStatusProps {
  available: boolean;
  class?: string;
}

const VehicleStatus: Component<VehicleStatusProps> = (props) => {
  const { t } = useTranslations();

  return (
    <Show
      when={props.available}
      fallback={
        <p
          class={cn(
            'text-error-500 flex items-center gap-0.5 text-sm',
            props.class
          )}
        >
          <IconCircleXFilled class='h-4 w-4' />
          <span>{t('VEHICLES.STATUS.UNAVAILBLE')}</span>
        </p>
      }
    >
      <p
        class={cn(
          'text-success-500 flex items-center gap-0.5 text-sm',
          props.class
        )}
      >
        <IconCircleCheckFilled class='h-4 w-4' />
        <span>{t('VEHICLES.STATUS.AVAILABLE')}</span>
      </p>
    </Show>
  );
};

export default VehicleStatus;
