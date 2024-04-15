import { NumberFormat, useTranslations } from '@/features/i18n';
import { IconCamera, IconRulerMeasure } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface MapPopupProps {
  railingId: number;
  captureGrade?: number;
  length: number;
  capturedAt?: string;
}

const MapPopup: Component<MapPopupProps> = (props) => {
  const { n } = useTranslations();

  return (
    <div class='h-16 w-48'>
      <div class='flex flex-col rounded-lg border-2 border-gray-300 bg-gray-50 p-1'>
        <div class='flex justify-between'>
          <div class='flex items-center gap-1'>
            <p class='font-bold'>{props.railingId}</p>
            <p class='text-success-700 text-sm'>
              {n(
                props.captureGrade === undefined ? 0 : props.captureGrade * 10,
                NumberFormat.PERCENTAGE
              )}
            </p>
          </div>
          <p>X</p>
        </div>
        <div class='flex flex-col'>
          <hr class='my-0.5 h-0.5 border-0 bg-gray-300' />
          <div class='flex items-center gap-1'>
            <IconRulerMeasure class='size-5' />
            <p class='text-gray-600'>{props.length}</p>
          </div>
          <div class='flex items-center gap-1'>
            <IconCamera class='size-5' />
            <p class='text-gray-600'>{props.capturedAt}</p>
          </div>
        </div>
      </div>
      <div class='flex justify-center'>
        <div class='h-0 w-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-gray-50' />
      </div>
    </div>
  );
};

export default MapPopup;
