import { cn } from '@/lib/utils';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-solidjs';
import dayjs, { type Dayjs } from 'dayjs';
import { Component, For, createSignal } from 'solid-js';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useCalendar } from './hooks';

export interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
}

const DatePicker: Component<DatePickerProps> = (props) => {
  const { weeks, next, previous, reference, setReference } = useCalendar();
  const [selectedDate, setSelectedDate] = createSignal(dayjs(props.value));

  const weekdays = dayjs.weekdaysShort();
  weekdays.push(weekdays.shift()!); // move sunday to the end

  const handleChange = (date: Dayjs) => {
    const diff = date.month() - reference().month();
    const navigate = diff > 0 ? next : previous;
    if (diff !== 0) navigate();
    setSelectedDate(date);
    props.onChange(date.toDate());
  };

  const handleOpenChange = (open: boolean) => {
    if (open && !reference().isSame(selectedDate(), 'month')) {
      setReference(selectedDate());
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger class='focus:outline-none'>
        <Input
          type='date'
          value={selectedDate().format('YYYY-MM-DD')}
          onChange={(e) => setSelectedDate(dayjs(e.currentTarget.value))}
          onClick={(e) => e.preventDefault()}
        />
      </PopoverTrigger>

      <PopoverContent>
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
                            selectedDate().isSame(day, 'day') &&
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
