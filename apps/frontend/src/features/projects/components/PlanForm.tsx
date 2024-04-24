import DatePicker from '@/components/temporal/DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/features/i18n';
import {
  useVehicleDetailsQuery,
  useVehiclesQuery,
} from '@/features/vehicles/api';
import VehicleSelect from '@/features/vehicles/components/VehicleSelect';
import { cn } from '@/lib/utils';
import { RailingImportDetails } from '@isi-insight/client';
import {
  SubmitHandler,
  createForm,
  setValue,
  zodForm,
} from '@modular-forms/solid';
import dayjs from 'dayjs';
import { Component, For, Show, createSignal } from 'solid-js';
import { ProjectPlanSchema, ProjectPlanSchemaValues } from '../api';

export interface PlanFormProps {
  planId?: string;
  importUrl?: string;
  startsAt?: string;
  endsAt?: string;
  vehicleId?: string;
  imports?: RailingImportDetails[];
  onSubmit?: (values: ProjectPlanSchemaValues) => void;
}

const PlanForm: Component<PlanFormProps> = (props) => {
  const [availableFrom, setAvailableFrom] = createSignal<string>();
  const [availableTo, setAvailableTo] = createSignal<string>();
  const [selectedImport, setSelectedImport] = createSignal(
    props?.imports?.[0]?.importedAt
  );

  const [form, { Form, Field }] = createForm({
    validate: zodForm(ProjectPlanSchema),
    initialValues: {
      importUrl: props.importUrl,
      startsAt: props.startsAt,
      endsAt: props.endsAt,
      vehicleId: props.vehicleId,
    },
  });

  const { t } = useTranslations();
  const vehicles = useVehiclesQuery(availableFrom, availableTo);
  const vehicle = useVehicleDetailsQuery(props?.vehicleId!);

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
            onChange={(event) => {
              setValue(form, 'importUrl', event.target.value);
              setSelectedImport('');
            }}
          />
        )}
      </Field>

      <Show when={props.imports}>
        <Label class='mt-2'>{t('PLANS.FORM.PREVIOUS_IMPORTS')}</Label>

        <PreviousImports
          imports={props.imports ?? []}
          selected={selectedImport}
          setSelected={setSelectedImport}
          onChange={(url) => setValue(form, 'importUrl', url)}
        />
      </Show>

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
          <Show when={vehicle.data || !props.vehicleId}>
            <VehicleSelect
              value={vehicle.data ?? undefined}
              vehicles={vehicles.data ?? []}
              onChange={(v) => setValue(form, 'vehicleId', v?.id)}
              emptyText={t('VEHICLES.NO_VEHICLE_SELECTED')}
            />
          </Show>
        )}
      </Field>

      <Button class='mt-2 grow' type='submit'>
        {t('GENERAL.IMPORT_AND_SAVE')}
      </Button>
    </Form>
  );
};

export interface PreviousImportProps {
  imports: RailingImportDetails[];
  onChange?: (url: string) => void;
  selected: () => string | undefined;
  setSelected: (value: string) => void;
}

const PreviousImports: Component<PreviousImportProps> = (props) => {
  const { d, t } = useTranslations();

  const handleChange = (url: string, importedAt: string) => {
    if (props.selected() === importedAt) {
      props.setSelected('');
      props.onChange?.('');
    } else {
      props.setSelected(importedAt);
      props.onChange?.(url);
    }
  };

  return (
    <div class='grid max-h-32 grid-cols-1 gap-2 overflow-y-auto pb-1 pr-1'>
      <For each={props.imports}>
        {(importDetails) => (
          <button
            title={importDetails.url}
            type='button'
            onClick={() =>
              handleChange(importDetails.url, importDetails.importedAt)
            }
            class={cn(
              `flex select-none flex-col overflow-hidden rounded-md border
               p-2 text-sm transition-all hover:cursor-pointer hover:bg-gray-100
                dark:border-gray-800 dark:hover:bg-gray-900`,
              props.selected() === importDetails.importedAt &&
                `border-brand-blue-500 dark:border-brand-blue-600 bg-brand-blue-50/40
                 dark:bg-brand-blue-950/60 hover:bg-brand-blue-50/80 dark:hover:bg-brand-blue-950/80 `
            )}
          >
            <p class='flex flex-row gap-1'>
              <span class='font-semibold'>{t('RAILINGS.TITLE')}:</span>
              <span>{importDetails.count}</span>
            </p>
            <p class='flex flex-row items-center gap-1'>
              <span class='font-semibold'>{t('GENERAL.UPDATED_AT')}:</span>
              <span>{d(importDetails.importedAt)}</span>
            </p>
            <p class='flex flex-row items-center gap-1'>
              <span class='font-semibold'>URL:</span>
              <span class='max-w-96 truncate'>{importDetails.url}</span>
            </p>
          </button>
        )}
      </For>
    </div>
  );
};
export default PlanForm;
