import { PositionEvent, PositionSubject } from '@isi-insight/client';
import dayjs, { Dayjs } from 'dayjs';
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
} from 'solid-js';

export interface PositionParams {
  type: PositionSubject;
  id: string;
}

/**
 * Hook for subscribing to the positions of a subject or all subjects.
 *
 * @param subject optional, the subject to subscribe to the positions of
 *
 * @returns the positions and the last time they were updated
 */
export const usePositions = (
  subjectType: PositionSubject,
  subjectId?: Accessor<string>
) => {
  const [positions, setPositions] = createSignal<PositionEvent[]>();
  const [lastUpdated, setLastUpdated] = createSignal<Dayjs>();

  createEffect(() => {
    const id = subjectId?.();
    const searchParams = new URLSearchParams();
    searchParams.set('subject-type', subjectType);

    if (id) {
      searchParams.set('id', id);
    }

    const es = new EventSource(
      '/api/v1/positions/events?' + searchParams.toString()
    );

    es.addEventListener('message', (event: MessageEvent<string>) => {
      const data: PositionEvent[] = JSON.parse(event.data);
      setPositions(data);
      setLastUpdated(dayjs());
    });

    onCleanup(() => {
      if (es.readyState !== es.CLOSED) es.close();
    });
  });

  return { positions, lastUpdated };
};

/**
 * Hook for subscribing to the position of a single subject.
 *
 * @param subject the subject to subscribe to the position of
 *
 * @returns the subjects position and the last time it was updated
 */
export const useSubjectPosition = (
  subjectType: PositionSubject,
  subjectId: Accessor<string>
) => {
  const sub = usePositions(subjectType, subjectId);

  const position = createMemo(() => {
    return sub.positions()?.[0];
  });

  return { position, lastUpdated: sub.lastUpdated };
};
