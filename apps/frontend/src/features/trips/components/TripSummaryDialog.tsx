import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NumberFormat, useTranslations } from '@/features/i18n';
import { CameraPosition, CaptureDetails } from '@isi-insight/client';
import { useNavigate } from '@solidjs/router';
import {
  IconAlertCircleFilled,
  IconCheck,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconExclamationMark,
  IconX,
} from '@tabler/icons-solidjs';
import { cva } from 'class-variance-authority';
import dayjs from 'dayjs';
import { Component, For, Match, Switch } from 'solid-js';
import { z } from 'zod';
import { useTripMutation } from '../api';
import { ImageAnalysis, ImageStatus, getImageAnalysis } from '../utils';

export interface TripSummaryDialogProps {
  open: boolean;
  tripId: string;
  captureDetails?: CaptureDetails;
  onOpenChange: (open: boolean) => void;
}

export const TripSummarySchema = z.object({
  tripId: z.string(),
});

export type TripSummarySchemaValues = z.infer<typeof TripSummarySchema>;

const TripSummaryDialog: Component<TripSummaryDialogProps> = (props) => {
  const navigate = useNavigate();
  const { update } = useTripMutation();
  const { t, n } = useTranslations();

  const handleSubmit = async (values: TripSummarySchemaValues) => {
    try {
      await update.mutateAsync({
        tripId: values.tripId,
        endedAt: dayjs().toDate(),
      });

      navigate('../..');
    } catch (error) {
      // ignored
    }
  };

  const analysis = () => getImageAnalysis(props.captureDetails?.images ?? {});

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('TRIPS.TRIP_SUMMARY.TITLE')}</DialogTitle>
        </DialogHeader>

        <p>
          {t('TRIPS.TRIP_SUMMARY.TOTAL_RAILING_METERS_CAPTURED', {
            meters: n(
              props.captureDetails?.metersCaptured ?? 0,
              NumberFormat.INTEGER
            ),
          })}
        </p>

        <ImageSummary analysis={analysis()} />

        <Button
          variant='destructive'
          onClick={() =>
            handleSubmit({
              tripId: props.tripId,
            })
          }
        >
          {t('TRIPS.END_TRIP')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

interface ImageSummaryProps {
  analysis: ImageAnalysis;
}

const tripSummaryVariants = cva(
  'relative overflow-hidden rounded-lg border p-2 justify-between',
  {
    variants: {
      status: {
        [ImageStatus.OK]:
          'border-success-600 bg-success-50 text-success-950 dark:bg-success-950/25 dark:text-success-50',
        [ImageStatus.OUT_OF_TOLERANCE]:
          'border-error-600 bg-error-50 dark:bg-error-950/25 dark:border-error-800',
        [ImageStatus.WITHIN_TOLERANCE]:
          'border-warning-600 bg-warning-50 dark:bg-warning-950/25 dark:border-warning-800',
      },
    },
    defaultVariants: {
      status: ImageStatus.OK,
    },
  }
);

interface ImagePositionStatusProps {
  position: CameraPosition;
  count: number;
  status: ImageStatus;
}

const ImagePositionStatus: Component<ImagePositionStatusProps> = (props) => {
  const { t, n } = useTranslations();

  return (
    <div class='flex flex-row items-center justify-between'>
      <p class='text-sm'>{t(`TRIPS.TRIP_SUMMARY.${props.position}`)}</p>

      <div class='flex items-center gap-2'>
        <p class='text-sm'>{n(props.count)}</p>

        <Switch>
          <Match when={props.status === ImageStatus.OK}>
            <IconCheck class='text-success-600 size-5' />
          </Match>
          <Match when={props.status === ImageStatus.OUT_OF_TOLERANCE}>
            <IconX class='text-error-600 size-5' />
          </Match>
          <Match when={props.status === ImageStatus.WITHIN_TOLERANCE}>
            <IconExclamationMark class='text-warning-600 size-5' />
          </Match>
        </Switch>
      </div>
    </div>
  );
};

const ImageSummary: Component<ImageSummaryProps> = (props) => {
  const { t } = useTranslations();

  return (
    <div class={tripSummaryVariants({ status: props.analysis.overall })}>
      <div class='flex flex-row justify-between pb-2'>
        <p class='max-w-full self-center truncate font-medium'>
          {t('TRIPS.TRIP_SUMMARY.AMOUNT_OF_IMAGES_TAKEN')}
        </p>

        <Switch>
          <Match when={props.analysis.overall === ImageStatus.OK}>
            <IconCircleCheckFilled class='text-success-600 size-5' />
          </Match>
          <Match when={props.analysis.overall === ImageStatus.OUT_OF_TOLERANCE}>
            <IconCircleXFilled class='text-error-600 size-5' />
          </Match>
          <Match when={props.analysis.overall === ImageStatus.WITHIN_TOLERANCE}>
            <IconAlertCircleFilled class='text-warning-600 size-5' />
          </Match>
        </Switch>
      </div>

      <ImagePositionStatus
        position='LEFT'
        count={props.analysis.positions.LEFT.count}
        status={props.analysis.positions.LEFT.status}
      />

      <ImagePositionStatus
        position='RIGHT'
        count={props.analysis.positions.RIGHT.count}
        status={props.analysis.positions.RIGHT.status}
      />

      <ImagePositionStatus
        position='TOP'
        count={props.analysis.positions.TOP.count}
        status={props.analysis.positions.TOP.status}
      />

      <ul class='text-error-500 mt-2 list-inside list-disc text-sm'>
        <For each={props.analysis.remarks}>
          {(remark) => (
            <li>
              <span class='-ml-2'>
                {t(`TRIPS.TRIP_SUMMARY.REMARKS.${remark}`)}
              </span>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default TripSummaryDialog;
