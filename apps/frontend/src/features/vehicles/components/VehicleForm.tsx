import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { createForm, zodForm } from '@modular-forms/solid';
import { Component, Show } from 'solid-js';
import { VehicleSchema, VehicleSchemaValues } from '../api';

export interface VehicleFormProps {
  class?: string;
  vehicleId?: string;
  registrationNumber?: string;
  camera?: boolean;
  description?: string;
  gnssId?: string;
  onSubmit: (values: VehicleSchemaValues) => void;
}

const VehicleForm: Component<VehicleFormProps> = (props) => {
  const { t } = useTranslations();
  const [, { Form, Field }] = createForm({
    validate: zodForm(VehicleSchema),
    initialValues: {
      vehicleId: props.vehicleId,
      registrationNumber: props.registrationNumber,
      camera: props.camera,
      description: props.description,
      gnssId: props.gnssId,
    },
  });

  return (
    <Form
      class={cn('flex flex-col gap-1', props.class)}
      onSubmit={props.onSubmit}
    >
      <Label for='registrationNumber'>
        {t('VEHICLES.FORM.REGISTRATION_NUMBER')}
      </Label>

      <Field name='registrationNumber'>
        {(field, props) => (
          <Input {...props} type='text' placeholder='' value={field.value} />
        )}
      </Field>

      <Label for='model' class='mt-2'>
        {t('VEHICLES.FORM.MODEL')}
      </Label>

      <Field name='model'>
        {(field, props) => (
          <Input {...props} type='text' placeholder='' value={field.value} />
        )}
      </Field>

      <Label for='gnssId' class='mt-2'>
        {t('VEHICLES.FORM.GNSS_ID')}
      </Label>

      <Field name='gnssId'>
        {(field, props) => (
          <Input {...props} type='text' placeholder='' value={field.value} />
        )}
      </Field>

      <Label for='description' class='mt-2'>
        {t('VEHICLES.FORM.DESCRIPTION')}
      </Label>

      <Field name='description'>
        {(field, props) => <Input {...props} type='text' value={field.value} />}
      </Field>

      <Button type='submit' class='mt-auto'>
        <Show
          when={props.vehicleId}
          fallback={t('VEHICLES.FORM.CREATE_VEHICLE')}
        >
          {t('VEHICLES.FORM.UPDATE_VEHICLE')}
        </Show>
      </Button>
    </Form>
  );
};

export default VehicleForm;
