import DatePicker from '@/components/temporal/DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import ErrorLabel from '@/features/error/components/ErrorLabel';
import { useTranslations } from '@/features/i18n';
import {
  useVehicleDetailsQuery,
  useVehiclesQuery,
} from '@/features/vehicles/api';
import VehicleSelect from '@/features/vehicles/components/VehicleSelect';
import { RailingImportDetails } from '@isi-insight/client';
import {
  SubmitHandler,
  createForm,
  setValue,
  zodForm,
} from '@modular-forms/solid';
import { A } from '@solidjs/router';
import { IconArrowNarrowUp } from '@tabler/icons-solidjs';
import dayjs from 'dayjs';
import { Component, For, Show, createSignal } from 'solid-js';
import { ProjectPlanSchema, ProjectPlanSchemaValues } from '../api';
import { SwitchButton } from '@/components/ui/switch-button';

export interface PlanFormProps {
  planId?: string;
  importUrl?: string;
  startsAt?: string;
  endsAt?: string;
  vehicleId?: string;
  imports?: RailingImportDetails[];
  onSubmit?: (values: ProjectPlanSchemaValues) => void;
  editing: boolean;
}

const PlanForm: Component<PlanFormProps> = (props) => {
  const [availableFrom, setAvailableFrom] = createSignal<string>();
  const [availableTo, setAvailableTo] = createSignal<string>();

  const [reimportRailings, setReimportRailings] = createSignal(false);

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
      <Show when={props.editing}>
        <div class='flex items-center'>
          <SwitchButton
            onChange={() => setReimportRailings(!reimportRailings())}
          />
          <p class='text-sm'>{t('PLANS.FORM.REIMPORT_RAILINGS')}</p>
        </div>
      </Show>

      <Show when={reimportRailings() || !props.editing}>
        <Field name='importUrl'>
          {(field, props) => (
            <>
              <Label for={field.name} class='mt-2'>
                {t('RAILINGS.RAILING_IMPORT_URL')}
              </Label>
              <Input
                {...props}
                type='url'
                id='importUrl'
                placeholder={t('GENERAL.URL')}
                value={field.value}
                onChange={(event) => {
                  setValue(form, 'importUrl', event.target.value);
                }}
              />
              <ErrorLabel text={field.error} />
            </>
          )}
        </Field>

        <Show when={props.imports}>
          <Label class='mt-2'>{t('PLANS.FORM.PREVIOUS_IMPORTS')}</Label>
          <PreviousImports
            imports={props.imports ?? []}
            onChange={(url) => setValue(form, 'importUrl', url)}
          />
        </Show>
      </Show>

      <div class='flex justify-between gap-2'>
        <div class='flex-1'>
          <Field name='startsAt' type='string'>
            {(field) => (
              <>
                <Label for={field.name}>{t('GENERAL.START_DATE')}</Label>
                <DatePicker
                  value={dayjs(field.value).toDate()}
                  class='w-full'
                  onChange={(v) => {
                    setAvailableFrom(v!.toISOString());
                    setValue(form, 'startsAt', v!.toISOString());
                  }}
                />
                <ErrorLabel text={field.error} />
              </>
            )}
          </Field>
        </div>

        <div class='flex-1'>
          <Field name='endsAt' type='string'>
            {(field) => (
              <>
                <Label for={field.name}>{t('GENERAL.END_DATE')}</Label>
                <DatePicker
                  value={dayjs(field.value).toDate()}
                  class='w-full'
                  onChange={(v) => {
                    setAvailableTo(v!.toISOString());
                    setValue(form, 'endsAt', v!.toISOString());
                  }}
                />
                <ErrorLabel text={field.error} />
              </>
            )}
          </Field>
        </div>
      </div>

      <Field name='vehicleId'>
        {(field) => (
          <Show when={vehicle.data || !props.vehicleId}>
            <Label for={field.name} class='mt-2'>
              {t('VEHICLES.VEHICLE')}
            </Label>
            <VehicleSelect
              value={vehicle.data ?? undefined}
              vehicles={vehicles.data ?? []}
              onChange={(v) => setValue(form, 'vehicleId', v?.id)}
              emptyText={t('VEHICLES.NO_VEHICLE_SELECTED')}
            />
            <ErrorLabel text={field.error} />
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
}

const PreviousImports: Component<PreviousImportProps> = (props) => {
  const { d, t } = useTranslations();

  const handleChange = (url: string) => {
    props.onChange?.(url);
  };

  function removeBaseUrl(fullUrl) {
    const parsedUrl = new URL(fullUrl);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}/`;
    return fullUrl.replace(baseUrl, '');
  }

  return (
    <div class='grid grid-cols-1 gap-2 px-1'>
      <For each={props.imports}>
        {(importDetails, index) => (
          <>
            <div class='flex flex-row items-center justify-between'>
              <div class='flex flex-col'>
                <A
                  href={importDetails.url}
                  target='_blank'
                  title={importDetails.url}
                  class='max-w-96 truncate hover:underline'
                >
                  {removeBaseUrl(importDetails.url)}
                </A>
                <div class='flex flex-row gap-2'>
                  <p>{d(importDetails.importedAt)}</p> {'-'}
                  <p>
                    {importDetails.count} {t('RAILINGS.TITLE')}
                  </p>
                </div>
              </div>
              <Button
                type='button'
                onClick={() => handleChange(importDetails.url)}
              >
                <IconArrowNarrowUp class='size-6' />
              </Button>
            </div>
            <Show
              when={
                props.imports.length > 1 && index() !== props.imports.length - 1
              }
            >
              <Separator />
            </Show>
          </>
        )}
      </For>
    </div>
  );
};
export default PlanForm;
