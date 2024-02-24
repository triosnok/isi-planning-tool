import dayjs, { type Dayjs } from 'dayjs';
import { createMemo, createSignal } from 'solid-js';

/**
 * Hook for getting the days of a month including the entering and exiting weeks.
 * (the last few and the first few days of next and previous months)
 *
 * @param initial the date to use as a reference for finding the weeks
 *
 * @returns an object containing the reference date, functions for navigating, and the weeks in the month
 */
export const useCalendar = (initial?: Dayjs) => {
  const [reference, setReference] = createSignal(
    (initial ?? dayjs()).startOf('day')
  );

  const weeks = createMemo(() => {
    const weeks: Dayjs[][] = [];
    const start = reference()
      .startOf('month')
      .subtract(1, 'day')
      .startOf('week');

    const end = reference().endOf('month').subtract(1, 'day').endOf('week');

    let current = start;
    let nextWeek = start.add(1, 'week');
    let weekDates: Dayjs[] = [];

    while (current.isBefore(end, 'day') || current.isSame(end, 'day')) {
      current = current.add(1, 'day');
      weekDates.push(current);

      if (current.isSame(nextWeek, 'week')) {
        nextWeek = nextWeek.add(1, 'week');
        weeks.push(weekDates);
        weekDates = [];
      }
    }

    return weeks;
  });

  const next = () => setReference(reference().add(1, 'month'));
  const previous = () => setReference(reference().subtract(1, 'month'));

  return { reference, setReference, next, previous, weeks };
};
