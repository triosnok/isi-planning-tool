import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from '@/features/i18n';
import { VehicleDetails } from '@isi-insight/client';
import { A } from '@solidjs/router';
import {
  Icon123,
  IconCamera,
  IconCircleCheckFilled,
} from '@tabler/icons-solidjs';
import { Component, Show, createSignal } from 'solid-js';

export interface VehicleSelectProps {
  value?: VehicleDetails;
  vehicles: VehicleDetails[];
  emptyText?: string;
  onChange?: (vehicle?: VehicleDetails) => void;
}

const VehicleSelect: Component<VehicleSelectProps> = (props) => {
  const [value, setValue] = createSignal(props.value);

  const handleChange = (value?: VehicleDetails) => {
    setValue(value);
    props.onChange?.(value);
  };

  const hasVehicles = () => props.vehicles.length > 0;

  return (
    <Show when={hasVehicles()} fallback={<EmptyState />}>
    <Select<VehicleDetails>
      value={value()}
      onChange={handleChange}
      options={props.vehicles}
      optionValue='id'
      itemComponent={(props) => (
        <SelectItem class='w-full' item={props.item}>
          <VehicleSelectItem {...props.item.rawValue} />
        </SelectItem>
      )}
    >
      <SelectTrigger class='h-20'>
        <Show
          when={value()}
          fallback={<NoVehiclesSelected emptyText={props.emptyText} />}
        >
          {(selectedVehicle) => (
            <SelectValue class='h-fit flex-1'>
              <VehicleSelectItem selected {...selectedVehicle()} />
            </SelectValue>
          )}
        </Show>
      </SelectTrigger>

      <SelectContent />
    </Select>
    </Show>
  );
};

interface VehicleSelectItemProps extends VehicleDetails {
  selected?: boolean;
}

const EmptyState: Component = () => {
  const { t } = useTranslations();

  return (
    <div class='relative h-20 flex justify-center flex-col rounded-md border px-3 py-2'>
      <p class='text-gray-500 text-sm'>{t('VEHICLES.NO_VEHICLES_REGISTERED')}</p>
      <A href='/vehicles/new' class='text-brand-blue-400 underline text-sm w-fit'>
        {t('VEHICLES.ADD_VEHICLE')}
      </A>
    </div>
  );
};

const VehicleSelectItem: Component<VehicleSelectItemProps> = (props) => {
  const { t } = useTranslations();

  return (
    <div class='relative w-full rounded-md text-left'>
      <p class='text-lg font-semibold'>{props.model}</p>

      <p class='flex items-center gap-0.5 text-sm'>
        <Icon123 class='h-5 w-5' />
        <span>{props.registrationNumber}</span>
      </p>

      <p class='flex items-center gap-0.5 text-sm'>
        <IconCamera class='h-5 w-5' />
        <span>{props.camera ? 'Yes' : 'No'}</span>
      </p>

      <p class='text-success-500 absolute right-2 top-2 flex items-center gap-0.5 text-sm'>
        <IconCircleCheckFilled class='h-4 w-4' />
        <span>{t('GENERAL.STATUSES.AVAILABLE')}</span>
      </p>
    </div>
  );
};

const NoVehiclesSelected: Component<{ emptyText?: string }> = (props) => {
  return (
    <div>
      <p>{props.emptyText}</p>
    </div>
  );
};

export default VehicleSelect;
