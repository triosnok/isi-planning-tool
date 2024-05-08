import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerHeader,
} from '@/components/ui/side-drawer';
import { useTranslations } from '@/features/i18n';
import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import { VehicleSchemaValues, useVehicleMutation } from '../api';
import VehicleForm from '../components/VehicleForm';

const AddVehicle: Component = () => {
  const { t } = useTranslations();
  const vehicleMutation = useVehicleMutation();
  const navigate = useNavigate();

  const handleSubmit = async (values: VehicleSchemaValues) => {
    try {
      await vehicleMutation.create.mutateAsync(values);
      navigate('/vehicles');
    } catch (error) {
      console.error('Failed to create vehicle');
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      navigate('/vehicles');
    }
  };

  return (
    <SideDrawer open onOpenChange={handleClose}>
      <SideDrawerContent class='flex flex-col'>
        <SideDrawerHeader>
          <h2 class='text-2xl font-bold'>{t('VEHICLES.ADD_VEHICLE')}</h2>
        </SideDrawerHeader>

        <VehicleForm isError={vehicleMutation.create.isError} onSubmit={handleSubmit} class='flex-1' />
      </SideDrawerContent>
    </SideDrawer>
  );
};

export default AddVehicle;
