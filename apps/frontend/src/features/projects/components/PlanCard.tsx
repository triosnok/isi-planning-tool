import { Component } from 'solid-js';
import { IconPoint, IconCar, IconPencil } from '@tabler/icons-solidjs';

export interface PlanCardProps {
  startsAt: string;
  endsAt: string;
  railingAmount: number;
  length: number;
  car: string;
  ongoingTripAmount?: number;
}

const PlanCard: Component<PlanCardProps> = ({
  startsAt,
  endsAt,
  railingAmount,
  length,
  car,
  ongoingTripAmount,
}) => {
  return (
    <div class='overflow-hidden rounded-lg border hover:cursor-pointer hover:bg-gray-100'>
      <div class='flex justify-between p-2'>
        <div class='flex items-center'>
          <IconPoint size={20} />
          <div class='flex flex-col'>
            <p class='text-success-700 text-xs'>
              {ongoingTripAmount} ongoing trips
            </p>
            <h3 class='text-xl font-semibold'>
              {startsAt} - {endsAt}
            </h3>
            <div class='flex items-center gap-1'>
              <IconCar size={20} />
              <p>{car}</p>
            </div>
          </div>
        </div>

        <div class='flex flex-col items-end'>
          <IconPencil size={20} />
          <p>{railingAmount} railings</p>
          <p>{length} m</p>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
