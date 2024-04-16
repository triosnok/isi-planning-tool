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
import { Icon123, IconCamera } from '@tabler/icons-solidjs';
import { Component, Show, createEffect, createSignal } from 'solid-js';
import { vehiclePreference } from '../context';
import VehicleStatus from './VehicleStatus';

export interface VehicleSelectProps {
  value?: VehicleDetails;
  vehicles: VehicleDetails[];
  emptyText?: string;
  onChange?: (vehicle?: VehicleDetails) => void;
  preferedVehicle?: boolean;
  store?: boolean;
}
const VehicleSelect: Component<VehicleSelectProps> = (props) => {
  const { selectedVehicle, setSelectedVehicle } = vehiclePreference();
  const [value, setValue] = createSignal(props.value);

  const handleChange = (value?: VehicleDetails) => {
    if (props.store) {
      setSelectedVehicle(value);
    } else {
      setValue(value);
    }
    props.onChange?.(value);
  };

  createEffect(() => {
    if (props.store || props.preferedVehicle) {
      setValue(selectedVehicle());
    }
  });

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
            when={props.store ? selectedVehicle() : value()}
            fallback={<NoVehiclesSelected emptyText={props.emptyText} />}
          >
            {(selectedVehicle) => (
              <SelectValue class='h-fit flex-1'>
                <VehicleSelectItem selected {...selectedVehicle()} />
              </SelectValue>
            )}
          </Show>
        </SelectTrigger>
        <SelectContent class='max-h-48 overflow-y-auto' />
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
    <div class='relative flex h-20 flex-col justify-center rounded-md border px-3 py-2'>
      <p class='text-sm text-gray-500 dark:text-gray-400'>
        {t('VEHICLES.NO_VEHICLES_REGISTERED')}
      </p>
      <A
        href='/vehicles/new'
        class='text-brand-blue-400 w-fit text-sm underline'
      >
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

      <VehicleStatus
        available={props.available}
        class='absolute right-2 top-2'
      />
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
