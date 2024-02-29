import { Button } from '@/components/ui/button';
import { IconType } from '@/lib/utils';
import {
  Icon123,
  IconCamera,
  IconCircleCheckFilled,
  IconGps,
} from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface VehicleCardProps {
  imageUrl: string;
  name: string;
  registrationNumber: string;
  camera: boolean;
  gnssId: string;
}

const VehicleCard: Component<VehicleCardProps> = (props) => {
  return (
    <div class='overflow-hidden rounded-md border'>
      <img class='h-24 w-full' src={props.imageUrl} />

      <div class='flex flex-col p-2 py-2'>
        <h2 class='self-center text-xl font-semibold'>{props.name}</h2>
        <VehicleStatus />

        <hr class='my-1 h-px w-full border-0 bg-gray-300' />

        <VehicleDetail icon={Icon123} text={props.registrationNumber} />
        <VehicleDetail icon={IconCamera} text={props.camera ? 'Yes' : 'No'} />
        <VehicleDetail icon={IconGps} text={props.gnssId} />
      </div>

      <Button class='h-fit w-full rounded-none py-1'>View car details</Button>
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
      <span>{props.text}</span>
    </p>
  );
};

export default VehicleCard;
