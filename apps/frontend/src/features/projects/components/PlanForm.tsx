import DatePicker from '@/components/temporal/DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/features/i18n';
import { useVehicleDetailsQuery, useVehiclesQuery } from '@/features/vehicles/api';
import VehicleSelect from '@/features/vehicles/components/VehicleSelect';
import {
  SubmitHandler,
  createForm,
  getValue,
  setValue,
  zodForm,
} from '@modular-forms/solid';
import dayjs from 'dayjs';
import { Component, createSignal } from 'solid-js';
import { z } from 'zod';
import { ProjectPlanSchema, ProjectPlanSchemaValues } from '../api';

export interface PlanFormProps {
  planId?: string;
  importUrl?: string;
  startsAt?: string;
  endsAt?: string;
  vehicleId?: string;
  onSubmit?: (values: ProjectPlanSchemaValues) => void;
}

const PlanForm: Component<PlanFormProps> = (props) => {
  const [availableFrom, setAvailableFrom] = createSignal<string>();
  const [availableTo, setAvailableTo] = createSignal<string>();

  const [form, { Form, Field }] = createForm({
    validate: zodForm(ProjectPlanSchema),
    initialValues: {
      startsAt: props.startsAt,
      endsAt: props.endsAt,
      vehicleId: props.vehicleId,
    },
  });

  const { t } = useTranslations();
  const vehicles = useVehiclesQuery(availableFrom, availableTo);

  const handleSubmit: SubmitHandler<ProjectPlanSchemaValues> = async (
    values
  ) => {
    props.onSubmit?.({ ...values, planId: props.planId });
  };

  return (
    <Form
      class='flex h-full flex-col justify-between gap-1'
      id='new-project-plan-form'
      onSubmit={handleSubmit}
    >
      <Label for='importUrl' class='mt-2'>
        {t('RAILINGS.RAILING_IMPORT_URL')}
      </Label>

      <Field name='importUrl'>
        {(field, props) => (
          <Input
            {...props}
            type='url'
            id='importUrl'
            placeholder={t('GENERAL.URL')}
            value={field.value}
          />
        )}
      </Field>

      <div class='flex justify-between gap-2'>
        <div class='flex-1'>
          <Label for='startsAt'>{t('GENERAL.START_DATE')}</Label>
          <Field name='startsAt' type='string'>
            {(field) => (
              <DatePicker
                value={dayjs(field.value).toDate()}
                class='w-full'
                onChange={(v) => {
                  setAvailableFrom(v!.toISOString());
                  setValue(form, 'startsAt', v!.toISOString());
                }}
              />
            )}
          </Field>
        </div>

        <div class='flex-1'>
          <Label for='endsAt'>{t('GENERAL.END_DATE')}</Label>
          <Field name='endsAt' type='string'>
            {(field) => (
              <DatePicker
                value={dayjs(field.value).toDate()}
                class='w-full'
                onChange={(v) => {
                  setAvailableTo(v!.toISOString());
                  setValue(form, 'endsAt', v!.toISOString());
                }}
              />
            )}
          </Field>
        </div>
      </div>

      <Label for='vehicle' class='mt-2'>
        {t('VEHICLES.VEHICLE')}
      </Label>

      <Field name='vehicleId'>
        {(_field) => (
          <VehicleSelect
            vehicles={vehicles.data ?? []}
            onChange={(v) => setValue(form, 'vehicleId', v?.id)}
            emptyText={t('VEHICLES.NO_VEHICLE_SELECTED')}
          />
        )}
      </Field>

      <Button class='mt-2 grow' type='submit'>
        {t('GENERAL.IMPORT_AND_SAVE')}
      </Button>
    </Form>
  );
};

export default PlanForm;
