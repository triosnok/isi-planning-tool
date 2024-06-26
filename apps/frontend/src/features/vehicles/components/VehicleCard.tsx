import { Button } from '@/components/ui/button';
import { useTranslations } from '@/features/i18n';
import { IconType, cn } from '@/lib/utils';
import {
  Icon123,
  IconCamera,
  IconCircleCheckFilled,
  IconGps,
  IconPhotoX,
} from '@tabler/icons-solidjs';
import { Component, Show } from 'solid-js';
import VehicleStatus from './VehicleStatus';
import IconProperty from '@/components/IconProperty';

export interface VehicleCardProps {
  imageUrl: string;
  name: string;
  registrationNumber: string;
  camera: boolean;
  gnssId: string;
  available: boolean;
  onDetailsClick?: () => void;
  class?: string;
}

const VehicleCard: Component<VehicleCardProps> = (props) => {
  const { t } = useTranslations();

  return (
    <div
      class={cn(
        'overflow-hidden rounded-md border dark:border-gray-800',
        props.class
      )}
    >
      <Show
        when={props.imageUrl}
        fallback={
          <div class='flex h-24 flex-col items-center justify-center bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'>
            <IconPhotoX class='h-7 w-7' />
            <span class='text-xs uppercase'>{t('GENERAL.NO_IMAGE')}</span>
          </div>
        }
      >
        {(url) => <img class='h-24 w-full object-cover' src={url()} />}
      </Show>

      <div class='m-2 flex flex-col'>
        <h2 class='max-w-full self-center truncate text-xl font-semibold'>
          {props.name}
        </h2>

        <VehicleStatus available={props.available} class='self-center' />

        <hr class='my-1 h-px w-full border-0 bg-gray-300 dark:bg-gray-700' />

        <IconProperty icon={Icon123} text={props.registrationNumber} />
        <IconProperty icon={IconCamera} text={props.camera ? 'Yes' : 'No'} />
        <IconProperty icon={IconGps} text={props.gnssId} />
      </div>

      <Button
        type='button'
        onClick={props.onDetailsClick}
        class='h-fit w-full rounded-none py-1'
      >
        {t('VEHICLES.VIEW_DETAILS')}
      </Button>
    </div>
  );
};

export default VehicleCard;
