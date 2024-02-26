import { IconArrowsUpDown, IconCamera } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface RailingCardProps {
  name: string;
  length: number;
  cameraSide: string;
  direction: string;
}

const RailingCard: Component<RailingCardProps> = ({
  name,
  length,
  cameraSide,
  direction,
}) => {
  return (
    <div class='flex justify-between border-b p-2 hover:cursor-pointer hover:bg-gray-100'>
      <div>
        <h3 class='text-lg font-semibold'>{name}</h3>
        <div class='flex items-center gap-1'>
          <IconCamera size={16} />
          <p>{cameraSide} side camera</p>
        </div>
        <div class='flex items-center gap-1'>
          <IconArrowsUpDown size={16} />
          <p>{direction} road</p>
        </div>
      </div>
      <p class='text-lg text-gray-600'>{length} m</p>
    </div>
  );
};

export default RailingCard;
