import { cn } from '@/lib/utils';
import {
  IconCalendarMonth,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from '@tabler/icons-solidjs';
import dayjs, { type Dayjs } from 'dayjs';
import { Component, For, JSX, Show, createSignal, onMount } from 'solid-js';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useCalendar } from './hooks';

export interface DatePickerProps {
  value?: Date | string;
  onChange?: (date?: Date) => void;
  clearable?: boolean;
  class?: string;
}

const DatePicker: Component<DatePickerProps> = (props) => {
  const { weeks, next, previous, reference, setReference } = useCalendar();
  const [isOpen, setIsOpen] = createSignal(false);
  const [selectedDate, setSelectedDate] = createSignal(
    props.value && dayjs(props.value).isValid() ? dayjs(props.value) : undefined
  );

  let triggerRef!: HTMLButtonElement;

  const weekdays = dayjs.weekdaysShort();
  weekdays.push(weekdays.shift()!); // move sunday to the end

  const emitChange = (date?: Dayjs) => {
    let processed = date?.startOf('day');

    if (processed) {
      processed = processed.add(processed.utcOffset(), 'minute');
    }

    props.onChange?.(processed?.toDate());
  };

  const handleChange = (date: Dayjs) => {
    const diff = date.month() - reference().month();
    const navigate = diff > 0 ? next : previous;
    if (diff !== 0) navigate();
    setSelectedDate(date);
    emitChange(date);
  };

  const handleOpenChange = (open: boolean) => {
    const date = selectedDate();
    setIsOpen(open);
    if (open && date !== undefined && !reference().isSame(date, 'month')) {
      setReference(date);
    }
  };

  const handleClear: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (
    event
  ) => {
    event.preventDefault();
    setSelectedDate(undefined);
    emitChange(undefined);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  onMount(() => {
    if (props.value && dayjs(props.value).isValid()) {
      emitChange(selectedDate());
    }
  });

  return (
    <Popover open={isOpen()} onOpenChange={handleOpenChange}>
      <div class={cn('relative w-fit', props.class)}>
        <PopoverTrigger
          as='div'
          ref={triggerRef}
          class={cn(
            'flex items-center gap-1 rounded-md border p-2 text-gray-700 focus:outline-none dark:border-gray-400 dark:text-gray-200',
            isOpen() && 'ring-2 ring-gray-300 dark:ring-gray-400'
          )}
          onFocus={handleFocus}
        >
          <IconCalendarMonth class='h-4 w-4' />

          <input
            type='text'
            readOnly
            value={selectedDate()?.format('YYYY-MM-DD') ?? ''}
            placeholder='YYYY-MM-DD'
            class='h-fit w-32 cursor-pointer select-none bg-transparent text-sm focus:outline-none'
            onClick={(e) => e.preventDefault()}
            tabIndex={-1}
          />
        </PopoverTrigger>

        <Show when={props.clearable}>
          <button
            type='button'
            onClick={handleClear}
            class={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700',
              selectedDate() === undefined && 'invisible'
            )}
          >
            <IconX class='h-4 w-4' />
            <span class='sr-only'>Clear date</span>
          </button>
        </Show>
      </div>

      <PopoverContent>
        <table>
          <thead>
            <tr>
              <th colSpan={7}>
                <div class='flex items-center justify-between'>
                  <button
                    onClick={previous}
                    class='rounded-md p-1 focus:bg-gray-200 focus:outline-none dark:focus:bg-gray-900'
                  >
                    <IconChevronLeft />
                  </button>

                  <span>{reference().format('MMMM YYYY')}</span>

                  <button
                    onClick={next}
                    class='rounded-md p-1 focus:bg-gray-200 focus:outline-none dark:focus:bg-gray-900'
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
                            'ring-brand-blue m-0.5 flex aspect-square w-8 items-center justify-center rounded-md ring-offset-2 focus:outline-none focus:ring-2',
                            'ring-offset-gray-50 hover:bg-gray-200',
                            'dark:focus dark:ring-offset-gray-950 dark:hover:bg-gray-900',
                            !day.isSame(reference(), 'month') &&
                              'text-gray-500',
                            selectedDate()?.isSame(day, 'day') &&
                              'bg-brand-blue focus:bg-brand-blue hover:bg-brand-blue dark:hover:bg-brand-blue text-gray-50'
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
