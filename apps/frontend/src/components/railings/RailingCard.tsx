import { IconArrowsUpDown, IconCamera } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface RailingCardProps {
  class?: string;
}

const RailingCard: Component<RailingCardProps> = (props) => {
  return (
    <div class='flex justify-between border-b p-2 hover:cursor-pointer hover:bg-gray-100'>
      <div>
        <h3 class='text-lg font-semibold'>EV39..</h3>
        <div class='flex items-center gap-1'>
          <IconCamera size={16} />
          <p>Right side camera</p>
        </div>
        <div class='flex items-center gap-1'>
          <IconArrowsUpDown size={16} />
          <p>With road</p>
        </div>
      </div>
      <p class='text-lg text-gray-600'>300 m</p>
    </div>
  );
};

export default RailingCard;
