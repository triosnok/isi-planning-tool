import { Component } from 'solid-js';
import { Progress } from '../ui/progress';
import {
  IconRoute,
  IconRulerMeasure,
  IconCalendarClock,
  IconCircleCheckFilled,
  IconAlertCircleFilled,
  IconMessage,
  IconPoint,
  IconCar,
  IconPencil,
} from '@tabler/icons-solidjs';

export interface PlanCardProps {
  class?: string;
}

const PlanCard: Component<PlanCardProps> = (props) => {
  return (
    <div class='overflow-hidden rounded-lg border hover:cursor-pointer hover:bg-gray-100'>
      <div class='flex justify-between p-2'>
        <div class='flex items-center'>
          <IconPoint size={20}/>
          <div class='flex flex-col'>
            <p class='text-success-700 text-xs'>1 ongoing trip</p>
            <h3 class='text-xl font-semibold'>Feb 15 - Feb 26</h3>
            <div class='flex items-center gap-1'>
              <IconCar size={20}/>
              <p>Corolla (UB 38122)</p>
            </div>
          </div>
        </div>

        <div class='flex flex-col items-end'>
          <IconPencil size={20}/>
          <p>200 railings</p>
          <p>1 490 m</p>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
