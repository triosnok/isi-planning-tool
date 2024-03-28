import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from '@/features/i18n';
import { useNavigate } from '@solidjs/router';
import { IconCheck, IconCircleCheckFilled } from '@tabler/icons-solidjs';
import { cva } from 'class-variance-authority';
import dayjs from 'dayjs';
import { Component } from 'solid-js';
import { z } from 'zod';
import { useTripMutation } from '../api';

export interface TripSummaryDialogProps {
  open: boolean;
  tripId: string;
  onOpenChange: (open: boolean) => void;
}

export const TripSummarySchema = z.object({
  tripId: z.string(),
});

export type TripSummarySchemaValues = z.infer<typeof TripSummarySchema>;

const TripSummaryDialog: Component<TripSummaryDialogProps> = (props) => {
  const navigate = useNavigate();
  const { update } = useTripMutation();
  const { t } = useTranslations();

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

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('TRIPS.TRIP_SUMMARY.TITLE')}</DialogTitle>
        </DialogHeader>

        <ImageSummary />

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
  //TODO: Add necessary props
}

enum TripStatus {
  OK,
  WITHIN_TOLERANCE,
  OUT_OF_TOLERANCE,
}

const ImageSummary: Component<ImageSummaryProps> = () => {
  const { t } = useTranslations();

  //TODO: Add necessary logic to determine the status of the trip

  const tripSummaryVariants = cva(
    'relative transition-colors hover:cursor-pointer overflow-hidden rounded-lg border p-2 justify-between',
    {
      variants: {
        status: {
          [TripStatus.OK]:
            'border-success-600 hover:bg-success-100 dark:hover:bg-success-900 bg-success-50 text-success-950 dark:bg-success-950 dark:text-success-50',
          [TripStatus.OUT_OF_TOLERANCE]:
            'border-error-600 hover:bg-error-100 dark:hover:bg-error-900 bg-error-50 dark:bg-error-950 dark:border-error-800',
          [TripStatus.WITHIN_TOLERANCE]:
            'border-warning-600 hover:bg-warning-100 dark:hover:bg-warning-900 bg-warning-50 dark:bg-warning-950 dark:border-warning-800',
        },
      },
      defaultVariants: {
        status: TripStatus.OK,
      },
    }
  );

  return (
    <div class={tripSummaryVariants({ status: TripStatus.OK })}>
      <div class='flex flex-row justify-between pb-2'>
        <p class='max-w-full self-center truncate font-medium'>
          {t('TRIPS.TRIP_SUMMARY.AMOUNT_OF_IMAGES_TAKEN')}
        </p>
        <IconCircleCheckFilled class='text-success-600 size-5' />
      </div>
      <div class='flex flex-row items-center justify-between'>
        <div>
          <p class='text-sm'>{t('TRIPS.TRIP_SUMMARY.LEFT')}</p>
        </div>
        <div class='flex items-center'>
          <p class='mr-2 text-sm'>24000</p>
          <IconCheck class='text-success-600 size-5' />
        </div>
      </div>

      <div class='flex flex-row items-center justify-between'>
        <div>
          <p class='text-sm'>{t('TRIPS.TRIP_SUMMARY.RIGHT')}</p>
        </div>
        <div class='flex items-center'>
          <p class='mr-2 text-sm'>24000</p>
          <IconCheck class='text-success-600 size-5' />
        </div>
      </div>

      <div class='flex flex-row items-center justify-between'>
        <div>
          <p class='text-sm'>{t('TRIPS.TRIP_SUMMARY.TOP')}</p>
        </div>
        <div class='flex items-center'>
          <p class='mr-2 text-sm'>12000</p>
          <IconCheck class='text-success-600 size-5' />
        </div>
      </div>

      {/*//TODO: Add appropriate error message */}
      {/* <Show when={false}>
        <p class='text-error-600 pt-2'>Images missing from top camera</p>
      </Show> */}
    </div>
  );
};

export default TripSummaryDialog;
