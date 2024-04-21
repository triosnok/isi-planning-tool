import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Slider,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from '@/components/ui/slider';
import { useTranslations } from '@/features/i18n';
import { useVehiclesQuery } from '@/features/vehicles/api';
import VehicleSelect from '@/features/vehicles/components/VehicleSelect';
import { vehiclePreference } from '@/features/vehicles/context';
import { VehicleDetails } from '@isi-insight/client';
import { useNavigate } from '@solidjs/router';
import { Component, createEffect, createSignal } from 'solid-js';
import { z } from 'zod';
import { useTripMutation } from '../api';
import { useCaptureLogsQuery } from '../api/capture';
import CaptureLogSelect from './CaptureLogSelect';

export interface NewTripDialogProps {
  open: boolean;
  projectId: string;
  planId?: string;
  onOpenChange: (open: boolean) => void;
}

export const CreateTripSchema = z.object({
  planId: z.string(),
  vehicleId: z.string(),
  captureLogId: z.string().optional(),
  replaySpeed: z.number().optional(),
});

export type CreateTripSchemaValues = z.infer<typeof CreateTripSchema>;

const NewTripDialog: Component<NewTripDialogProps> = (props) => {
  const vehicles = useVehiclesQuery();
  const preferedVehicle = vehiclePreference();
  const [selectedVehicle, setSelectedVehicle] = createSignal<VehicleDetails>();
  const [captureLogId, setCaptureLogId] = createSignal<string>();
  const [replaySpeed, setReplaySpeed] = createSignal<number>();
  const navigate = useNavigate();
  const logs = useCaptureLogsQuery();
  const { create } = useTripMutation();
  const { t } = useTranslations();

  createEffect(() => {
    if (props.open && !selectedVehicle()) {
      const preferred = preferedVehicle.selectedVehicle();
      setSelectedVehicle(preferred);
    }
  });

  const handleSubmit = async (values: CreateTripSchemaValues) => {
    try {
      const tripDetails = await create.mutateAsync(values);
      const tripId = tripDetails.id;

      props.onOpenChange(false);
      navigate(`/projects/${props.projectId}/trip/${tripId}`);
    } catch (error) {
      console.error('Failed to start trip');
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent class='max-w-xl'>
        <DialogHeader>
          <DialogTitle>{t('TRIPS.NEW_TRIP')}</DialogTitle>
        </DialogHeader>

        <Label required>Vehicle</Label>

        <VehicleSelect
          value={selectedVehicle()}
          onChange={setSelectedVehicle}
          vehicles={vehicles.data ?? []}
          emptyText={t('VEHICLES.NO_VEHICLE_SELECTED')}
        />

        <Label>Capture log</Label>

        <CaptureLogSelect
          logs={logs.data ?? []}
          onChange={(log) => setCaptureLogId(log?.name)}
        />

        <Label>Replay speed</Label>

        <Slider
          onChange={([v]) => setReplaySpeed(v)}
          minValue={1}
          maxValue={10}
        >
          <SliderTrack />
          <SliderFill />
          <SliderThumb />
        </Slider>

        <p class='flex w-full justify-between text-sm'>
          <span class='flex-1 text-gray-400 dark:text-gray-500'>1x</span>
          <span class='flex-1 text-center'>{replaySpeed() ?? 1}x</span>
          <span class='flex-1 text-right text-gray-400 dark:text-gray-500'>
            10x
          </span>
        </p>

        <Button
          disabled={!selectedVehicle()}
          onClick={() =>
            handleSubmit({
              vehicleId: selectedVehicle()?.id ?? '',
              planId: props.planId ?? '',
              captureLogId: captureLogId(),
              replaySpeed: replaySpeed(),
            })
          }
        >
          {t('TRIPS.START_TRIP')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewTripDialog;
