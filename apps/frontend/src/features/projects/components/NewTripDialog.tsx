import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useVehiclesQuery } from '@/features/vehicles/api';
import VehicleSelect from '@/features/vehicles/components/VehicleSelect';
import { VehicleDetails } from '@isi-insight/client';
import { useNavigate } from '@solidjs/router';
import { Component, createSignal } from 'solid-js';
import { z } from 'zod';
import { useTripMutation } from '../api';

export interface NewTripDialogProps {
  open: boolean;
  projectId: string;
  planId?: string;
  onOpenChange: (open: boolean) => void;
}

export const CreateTripSchema = z.object({
  planId: z.string(),
  vehicleId: z.string(),
});

export type CreateTripSchemaValues = z.infer<typeof CreateTripSchema>;

const NewTripDialog: Component<NewTripDialogProps> = (props) => {
  const vehicles = useVehiclesQuery();
  const [selectedVehicle, setSelectedVehicle] = createSignal<VehicleDetails>();
  const navigate = useNavigate();

  const { create } = useTripMutation();

  const handleSubmit = async (values: CreateTripSchemaValues) => {
    try {
      const tripDetails = await create.mutateAsync(values);
      const tripId = tripDetails.id;
      console.log(tripId);

      props.onOpenChange(false);
      navigate(`/projects/${props.projectId}/trip/${tripId}`);
    } catch (error) {
      console.error('Failed to start trip');
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New trip</DialogTitle>
        </DialogHeader>

        <VehicleSelect
          vehicles={vehicles.data ?? []}
          onChange={setSelectedVehicle}
        />

        <Button
          disabled={!selectedVehicle()}
          onClick={() =>
            handleSubmit({
              vehicleId: selectedVehicle()?.id ?? '',
              planId: props.planId ?? '',
            })
          }
        >
          Start trip
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewTripDialog;
