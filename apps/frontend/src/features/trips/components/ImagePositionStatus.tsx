import { NumberFormat, useTranslations } from '@/features/i18n';
import { CameraPosition, ImageStatus } from '@isi-insight/client';
import { IconCheck, IconExclamationMark, IconX } from '@tabler/icons-solidjs';
import { Component, Match, Switch } from 'solid-js';

export interface ImagePositionStatusProps {
  position: CameraPosition;
  count?: number;
  status?: ImageStatus;
}

const ImagePositionStatus: Component<ImagePositionStatusProps> = (props) => {
  const { t, n } = useTranslations();

  return (
    <div class='flex flex-row items-center justify-between'>
      <p class='text-sm'>{t(`TRIPS.TRIP_SUMMARY.${props.position}`)}</p>

      <div class='flex items-center gap-2'>
        <p class='text-sm'>{n(props.count, NumberFormat.INTEGER)}</p>

        <Switch>
          <Match when={props.status === 'OK'}>
            <IconCheck class='text-success-600 size-5' />
          </Match>
          <Match when={props.status === 'OUT_OF_TOLERANCE'}>
            <IconX class='text-error-600 size-5' />
          </Match>
          <Match when={props.status === 'WITHIN_TOLERANCE'}>
            <IconExclamationMark class='text-warning-600 size-5' />
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default ImagePositionStatus;
