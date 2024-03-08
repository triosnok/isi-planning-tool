import { Button } from '@/components/ui/button';
import { IconType } from '@/lib/utils';
import {
  Icon123,
  IconCamera,
  IconCircleCheckFilled,
  IconGps,
  IconPhotoX,
} from '@tabler/icons-solidjs';
import { Component, Show } from 'solid-js';

export interface VehicleCardProps {
  imageUrl: string;
  name: string;
  registrationNumber: string;
  camera: boolean;
  gnssId: string;
  onDetailsClick?: () => void;
}

const VehicleCard: Component<VehicleCardProps> = (props) => {
  return (
    <div class='overflow-hidden rounded-md border'>
      <Show
        when={props.imageUrl}
        fallback={
          <div class='flex h-24 flex-col items-center justify-center bg-gray-200 text-gray-500'>
            <IconPhotoX class='h-7 w-7' />
            <span class='uppercase text-xs'>No image</span>
          </div>
        }
      >
        {(url) => <img class='h-24 w-full' src={url()} />}
      </Show>

      <div class='relative flex flex-col p-2 py-2'>
        <h2 class='self-center text-xl font-semibold'>{props.name}</h2>
        <VehicleStatus />

        <hr class='my-1 h-px w-full border-0 bg-gray-300' />

        <VehicleDetail icon={Icon123} text={props.registrationNumber} />
        <VehicleDetail icon={IconCamera} text={props.camera ? 'Yes' : 'No'} />
        <VehicleDetail icon={IconGps} text={props.gnssId} />
      </div>

      <Button
        type='button'
        onClick={props.onDetailsClick}
        class='h-fit w-full rounded-none py-1'
      >
        View details
      </Button>
    </div>
  );
};

const VehicleStatus: Component = () => {
  return (
    <p class='text-success-600 flex items-center gap-0.5 self-center text-sm font-medium'>
      <IconCircleCheckFilled class='h-4 w-4' />
      <span>Available</span>
    </p>
  );
};

interface VehicleDetailProps {
  icon: IconType;
  text: string;
}

const VehicleDetail: Component<VehicleDetailProps> = (props) => {
  return (
    <p class='flex items-center gap-1 text-sm text-gray-800'>
      <props.icon class='h-5 w-5 text-gray-500' />
      <span class='truncate'>{props.text}</span>
    </p>
  );
};

export default VehicleCard;
