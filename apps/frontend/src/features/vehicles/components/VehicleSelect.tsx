import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VehicleDetails } from '@isi-insight/client';
import {
  Icon123,
  IconCamera,
  IconCircleCheckFilled,
} from '@tabler/icons-solidjs';
import { Component, Show, createEffect, createSignal } from 'solid-js';

export interface VehicleSelectProps {
  vehicles: VehicleDetails[];
  emptyText?: string;
  onChange: (vehicle: VehicleDetails) => void;
}

const VehicleSelect: Component<VehicleSelectProps> = (props) => {
  const [value, setValue] = createSignal<VehicleDetails>();

  createEffect(() => {
    console.log(value());
  });

  return (
    <Select<VehicleDetails>
      value={value()}
      onChange={setValue}
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
            <SelectValue class='flex-1 h-fit'>
              <VehicleSelectItem selected {...selectedVehicle()} />
            </SelectValue>
          )}
        </Show>
      </SelectTrigger>

      <SelectContent />
    </Select>
  );
};

interface VehicleSelectItemProps extends VehicleDetails {
  selected?: boolean;
}

const VehicleSelectItem: Component<VehicleSelectItemProps> = (props) => {
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
        <span>Available</span>
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
