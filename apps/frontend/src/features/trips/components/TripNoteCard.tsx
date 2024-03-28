import { IconChevronDown } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface TripNoteCardProps {
  timestamp: string;
  note: string;
}

const TripNoteCard: Component<TripNoteCardProps> = (props) => {
  return (
    <>
      <p class='mt-2 text-sm text-gray-500'>{props.timestamp}</p>
      <div class='space-y-2 rounded-md bg-gray-100 p-2 outline outline-1 outline-gray-200'>
        <p>{props.note}</p>
        <div class='flex items-center text-sm text-gray-600'>
          <IconChevronDown />
          <p>Click here to expand</p>
        </div>
      </div>
    </>
  );
};

export default TripNoteCard;
