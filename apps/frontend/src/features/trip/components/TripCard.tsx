import {
  IconAlertCircleFilled,
  IconMessage,
  IconRulerMeasure,
  IconSteeringWheel,
} from '@tabler/icons-solidjs';
import { Component } from 'solid-js';
export interface TripCardProps {
  date: string;
  deviations?: number;
  notes?: number;
  length?: number;
  car?: string;
}

const TripCard: Component<TripCardProps> = (props) => {
  return (
    <div class='relative overflow-hidden rounded-lg border p-2 hover:cursor-pointer hover:bg-gray-100'>
      <div class='flex flex-row items-center gap-2'>
        <p class='text-base font-semibold'>Trip 1</p>
        <p class='text-sm font-semibold text-gray-400'>{props.date}</p>
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
        <div class='flex flex-row gap-1'>
          <IconAlertCircleFilled size={20} class='text-warning-500' />
          <p class='text-warning-500'>{props.deviations} deviations</p>
        </div>

        <div class='flex flex-row justify-end gap-1'>
          <IconMessage size={20} />
          <p>{props.notes} notes</p>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
