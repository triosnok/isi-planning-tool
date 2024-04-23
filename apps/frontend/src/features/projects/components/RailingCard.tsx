import { useTranslations } from '@/features/i18n';
import { IconArrowsUpDown, IconCamera } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface RailingCardProps {
  name: string;
  length: number;
  cameraSide: string;
  direction: string;
}

const RailingCard: Component<RailingCardProps> = (props) => {
  const { t } = useTranslations();

  return (
    <div class='flex justify-between border-b p-2 hover:cursor-pointer hover:bg-gray-100'>
      <div>
        <h3 class='text-lg font-semibold'>{props.name}</h3>
        <div class='flex items-center gap-1'>
          <IconCamera size={16} />
          <p>
            {props.cameraSide} {t('RAILINGS.SIDE_CAMERA')}
          </p>
        </div>
        <div class='flex items-center gap-1'>
          <IconArrowsUpDown size={16} />
          <p>
            {props.direction} {t('ROADS.ROAD')}
          </p>
        </div>
      </div>
      <p class='text-lg text-gray-600'>{length} m</p>
    </div>
  );
};

export default RailingCard;
