import Dropzone from '@/components/input/Dropzone';
import { Button } from '@/components/ui/button';
import { Callout, CalloutContent, CalloutTitle } from '@/components/ui/callout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ErrorLabel from '@/features/error/components/ErrorLabel';
import { useFileUploadMutation } from '@/features/file';
import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { createForm, zodForm } from '@modular-forms/solid';
import { Component, Show, createSignal } from 'solid-js';
import { VehicleSchema, VehicleSchemaValues } from '../api';

export interface VehicleFormProps {
  class?: string;
  vehicleId?: string;
  registrationNumber?: string;
  camera?: boolean;
  description?: string;
  imageUrl?: string;
  model?: string;
  gnssId?: string;
  isError?: boolean;
  onSubmit: (values: VehicleSchemaValues) => void;
}

const VehicleForm: Component<VehicleFormProps> = (props) => {
  const { t } = useTranslations();
  const [vehicleImage, setVehicleImage] = createSignal<File | undefined>(
    undefined
  );
  const fileUploadQuery = useFileUploadMutation('vehicles');

  const [_form, { Form, Field }] = createForm({
    validate: zodForm(VehicleSchema),
    initialValues: {
      vehicleId: props.vehicleId,
      registrationNumber: props.registrationNumber,
      model: props.model,
      imageUrl: props.imageUrl,
      camera: props.camera ?? true,
      description: props.description,
      gnssId: props.gnssId,
    },
  });

  const handleSubmit = async (values: VehicleSchemaValues) => {
    try {
      if (vehicleImage()) {
        const image = await fileUploadQuery.mutateAsync(vehicleImage() as File);
        values.imageUrl = image.url;

        setVehicleImage(undefined);
      } else {
        values.imageUrl = props.imageUrl;
      }

      props.onSubmit(values);
    } catch (error) {
      // ignore
    }
  };

  return (
    <Form
      class={cn('flex flex-col gap-1', props.class)}
      onSubmit={handleSubmit}
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

      <label for='vehicleImage'>
        <Dropzone
          name='vehicleImage'
          title={t('VEHICLES.FORM.DROP_IMAGE_HERE') || ''}
          onChange={setVehicleImage}
          value={vehicleImage()}
          class='my-2'
        />
      </label>

      <Show when={props.isError}>
        <Callout variant={'error'}>
          <CalloutTitle>Error</CalloutTitle>
          <CalloutContent>
            {t('VEHICLES.FAILED_TO_UPDATE_VEHICLE')}
          </CalloutContent>
        </Callout>
      </Show>

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
