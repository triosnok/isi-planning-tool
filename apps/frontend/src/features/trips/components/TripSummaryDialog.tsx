import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from '@/features/i18n';
import { useNavigate } from '@solidjs/router';
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
          <DialogTitle>Trip Summary</DialogTitle>
        </DialogHeader>
        //TODO: Trip summary content
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
