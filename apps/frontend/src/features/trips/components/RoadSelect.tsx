import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from '@/features/i18n';
import { Component, Show, createSignal } from 'solid-js';
import { RoadSegmentDetails } from '@isi-insight/client';

export interface RoadSelectProps {
  value?: RoadSegmentDetails;
  roads: RoadSegmentDetails[];
  emptyText?: string;
  onChange?: (road?: RoadSegmentDetails) => void;
  roadType: string;
}

const RoadSelect: Component<RoadSelectProps> = (props) => {
  const [value, setValue] = createSignal(props.value);

  const handleChange = (value?: RoadSegmentDetails) => {
    setValue(value);
    props.onChange?.(value);
  };

  const hasRoads = () => props.roads.length > 0;

  return (
    <Show when={hasRoads()} fallback={<EmptyState />}>
      <Select<RoadSegmentDetails>
        value={value()}
        onChange={handleChange}
        options={props.roads}
        optionValue='id'
        itemComponent={(props) => (
          <SelectItem class='w-full' item={props.item}>
            <RoadSelectItem {...props.item.rawValue} roadType='fylkesveg' />
          </SelectItem>
        )}
      >
        <SelectTrigger class='h-20'>
          <Show
            when={value()}
            fallback={<NoRoadsSelected emptyText={props.emptyText} />}
          >
            {(selectedRoad) => (
              <SelectValue class='h-fit flex-1'>
                <RoadSelectItem
                  selected
                  {...selectedRoad()}
                  roadType='fylkesveg'
                />
              </SelectValue>
            )}
          </Show>
        </SelectTrigger>

        <SelectContent class='max-h-48 overflow-y-auto' />
      </Select>
    </Show>
  );
};

interface RoadSelectItemProps extends RoadSegmentDetails {
  selected?: boolean;
  roadType: string;
}

const EmptyState: Component = () => {
  const { t } = useTranslations();

  return (
    <div class='relative flex h-20 flex-col justify-center rounded-md border px-3 py-2'>
      <p class='text-sm text-gray-500 dark:text-gray-400'>
        {t('ROADS.NO_ROADS_AVAILABLE')}
      </p>
    </div>
  );
};

const RoadSelectItem: Component<RoadSelectItemProps> = (props) => {
  return (
    <div class='relative w-fit rounded-md text-left'>
      <Show when={props.roadType === 'europaveg'}>
        <p class='bg-success-600 px-2 py-1 text-lg font-semibold text-gray-50'>
          E39
        </p>
      </Show>
      <Show when={props.roadType === 'fylkesveg'}>
        <p class='rounded-md border-2 border-gray-950 bg-gray-50 px-2 py-1 text-lg font-semibold'>
          705
        </p>
      </Show>
    </div>
  );
};

const NoRoadsSelected: Component<{ emptyText?: string }> = (props) => {
  return (
    <div>
      <p>{props.emptyText}</p>
    </div>
  );
};

export default RoadSelect;
