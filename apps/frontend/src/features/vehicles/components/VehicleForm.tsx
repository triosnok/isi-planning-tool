import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ErrorLabel from '@/features/error/components/ErrorLabel';
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
  model?: string;
  gnssId?: string;
  onSubmit: (values: VehicleSchemaValues) => void;
}

const VehicleForm: Component<VehicleFormProps> = (props) => {
  const { t } = useTranslations();
  const [_form, { Form, Field }] = createForm({
    validate: zodForm(VehicleSchema),
    initialValues: {
      vehicleId: props.vehicleId,
      registrationNumber: props.registrationNumber,
      model: props.model,
      camera: props.camera ?? true,
      description: props.description,
      gnssId: props.gnssId,
    },
  });

  return (
    <Form
      class={cn('flex flex-col gap-1', props.class)}
      onSubmit={props.onSubmit}
    >
      <Field name='registrationNumber'>
        {(field, props) => (
          <>
            <Label for={field.name}>
              {t('VEHICLES.FORM.REGISTRATION_NUMBER')}
            </Label>

            <Input {...props} id={field.name} type='text' value={field.value} />
            <ErrorLabel text={field.error} />
          </>
        )}
      </Field>

      <Field name='model'>
        {(field, props) => (
          <>
            <Label for={field.name} class='mt-2'>
              {t('VEHICLES.FORM.MODEL')}
            </Label>

            <Input {...props} type='text' value={field.value} />
            <ErrorLabel text={field.error} />
          </>
        )}
      </Field>

      <Field name='camera' type='boolean' keepState>
        {() => null}
      </Field>

      <Field name='gnssId'>
        {(field, props) => (
          <>
            <Label for={field.name} class='mt-2'>
              {t('VEHICLES.FORM.GNSS_ID')}
            </Label>

            <Input {...props} type='text' value={field.value} />
            <ErrorLabel text={field.error} />
          </>
        )}
      </Field>

      <Field name='description'>
        {(field, props) => (
          <>
            <Label for={field.name} class='mt-2'>
              {t('VEHICLES.FORM.DESCRIPTION')}
            </Label>

            <Input {...props} type='text' value={field.value} />
            <ErrorLabel text={field.error} />
          </>
        )}
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
