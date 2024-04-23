import { IconArrowsUpDown, IconCamera } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';
import RoadSign from './RoadSign';

export interface RailingCardProps {
  id: number;
  length: number;
  roads: string[];
}

const RailingCard: Component<RailingCardProps> = (props) => {
  return (
    <div class='flex justify-between border-b p-2 hover:cursor-pointer hover:bg-gray-100'>
      <div>
        <h3 class='text-lg font-semibold'>{props.id}</h3>
      </div>
      <p class='text-lg text-gray-600'>{length} m</p>
    </div>
  );
};

export default RailingCard;
