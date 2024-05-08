import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NumberFormat, useTranslations } from '@/features/i18n';
import { CaptureDetails } from '@isi-insight/client';
import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import { z } from 'zod';
import { useTripMutation } from '../api';
import ImageSummary from './ImageSummary';

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
      });

      navigate('../..');
    } catch (error) {
      // ignored
    }
  };

  const analysis = () => props?.captureDetails?.imageAnalysis;

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

export default TripSummaryDialog;
