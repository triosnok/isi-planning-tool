import { cn } from '@/lib/utils';
import {
  IconCalendarMonth,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from '@tabler/icons-solidjs';
import dayjs, { type Dayjs } from 'dayjs';
import { Component, For, JSX, Show, createSignal } from 'solid-js';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useCalendar } from './hooks';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  clearable?: boolean;
  class?: string;
}

const DatePicker: Component<DatePickerProps> = (props) => {
  const { weeks, next, previous, reference, setReference } = useCalendar();
  const [selectedDate, setSelectedDate] = createSignal(
    props.clearable ? undefined : dayjs(props.value)
  );

  const weekdays = dayjs.weekdaysShort();
  weekdays.push(weekdays.shift()!); // move sunday to the end

  const handleChange = (date: Dayjs) => {
    const diff = date.month() - reference().month();
    const navigate = diff > 0 ? next : previous;
    if (diff !== 0) navigate();
    setSelectedDate(date);
    props.onChange?.(date.toDate());
  };

  const handleOpenChange = (open: boolean) => {
    const date = selectedDate();
    if (open && date !== undefined && !reference().isSame(date, 'month')) {
      setReference(date);
    }
  };

  const handleClear: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (
    event
  ) => {
    event.preventDefault();
    setSelectedDate(undefined);
    props.onChange?.(undefined);
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <div class={cn('relative w-fit', props.class)}>
        <PopoverTrigger
          as='div'
          class='flex items-center gap-1 rounded-md border p-2 text-gray-700 focus:outline-none'
        >
          <IconCalendarMonth class='h-4 w-4' />

          <input
            type='text'
            readOnly
            value={selectedDate()?.format('YYYY-MM-DD') ?? ''}
            placeholder='YYYY-MM-DD'
            class='h-fit w-32 cursor-pointer bg-transparent text-sm'
            onClick={(e) => e.preventDefault()}
          />
        </PopoverTrigger>

        <Show when={props.clearable}>
          <button
            type='button'
            onClick={handleClear}
            class={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-gray-200',
              selectedDate() === undefined && 'invisible'
            )}
          >
            <IconX class='h-4 w-4' />
            <span class='sr-only'>Clear date</span>
          </button>
        </Show>
      </div>

      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <table>
          <thead>
            <tr>
              <th colSpan={7}>
                <div class='flex items-center justify-between'>
                  <button
                    onClick={previous}
                    class='rounded-md p-1 focus:bg-gray-200 focus:outline-none'
                  >
                    <IconChevronLeft />
                  </button>

                  <span>{reference().format('MMMM YYYY')}</span>

                  <button
                    onClick={next}
                    class='rounded-md p-1 focus:bg-gray-200 focus:outline-none'
                  >
                    <IconChevronRight />
                  </button>
                </div>
              </th>
            </tr>
            <tr>
              <For each={weekdays}>
                {(day) => (
                  <th class='text-center text-sm font-semibold'>{day}</th>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={weeks()}>
              {(days) => (
                <tr>
                  <For each={days}>
                    {(day) => (
                      <td>
                        <button
                          onClick={() => handleChange(day)}
                          class={cn(
                            'flex aspect-square w-8 items-center justify-center rounded-md hover:bg-gray-200 focus:bg-gray-300 focus:outline-none',
                            day.isSame(reference(), 'month')
                              ? 'text-black'
                              : 'text-gray-400',
                            selectedDate()?.isSame(day, 'day') &&
                              'bg-brand-blue focus:bg-brand-blue hover:bg-brand-blue text-gray-50'
                          )}
                        >
                          <span>{day.format('D')}</span>
                        </button>
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
