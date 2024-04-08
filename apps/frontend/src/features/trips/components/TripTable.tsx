import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DateFormat, useTranslations } from '@/features/i18n';
import { A } from '@solidjs/router';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-solidjs';
import dayjs from 'dayjs';
import { Component, For, Show, createSignal } from 'solid-js';

type TripDetails = {
  id: string;
  projectId: string;
  projectPlanId: string;
  project: string;
  driver?: string;
  startedAt: string;
  endedAt?: string;
  sequenceNumber: number;
  noteCount: number;
  deviations: number;
};

export interface TripTableProps {
  trips: TripDetails[];
  driver?: boolean;
}

const TripTable: Component<TripTableProps> = (props) => {
  const { t, d } = useTranslations();

  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 5;
  const totalPages = () => Math.ceil(props.trips.length / itemsPerPage);

  const currentTrips = () =>
    props.trips.slice(
      (currentPage() - 1) * itemsPerPage,
      currentPage() * itemsPerPage
    );

  const itemRange = () => {
    const start = (currentPage() - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, props.trips.length);
    return `${start} - ${end} of ${props.trips.length}`;
  };

  const duration = (startedAt: string, endedAt: string) => {
    const start = dayjs(startedAt);
    const end = dayjs(endedAt);
    const duration = end.diff(start, 'minutes');
    const days = Math.floor(duration / 1440);
    const hours = Math.floor((duration % 1440) / 60);
    const minutes = duration % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div>
      <div class='flex flex-row items-center justify-between'>
        <Input placeholder={t('NAVIGATION.SEARCH')} class='mt-4 w-fit' />
        <div class='flex flex-row justify-end gap-2 pr-4 pt-4'>
          <div class='my-4 flex flex-row items-center justify-center gap-2'>
            <p class='rounded-full bg-gray-100 px-2 py-0.5 text-sm font-semibold text-gray-800 dark:bg-gray-900 dark:text-gray-200'>
              {itemRange()}
            </p>
            <Pagination
              currentPage={currentPage()}
              totalPages={totalPages()}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('TRIPS.TRIP_TABLE.START')}</TableHead>
            <TableHead>{t('TRIPS.TRIP_TABLE.DURATION')}</TableHead>
            <TableHead>{t('TRIPS.TRIP_TABLE.NAME')}</TableHead>
            <Show when={props.driver}>
              <TableHead>{t('TRIPS.TRIP_TABLE.DRIVER')}</TableHead>
            </Show>
            <TableHead class='leading-4'>
              {t('TRIPS.TRIP_TABLE.CAPTURE_REMARKS')}
            </TableHead>
            <TableHead class='leading-4'>
              {t('TRIPS.TRIP_TABLE.METERS_OF_RAILING_CAPTURED')}
            </TableHead>
            <TableHead>{t('TRIPS.TRIP_TABLE.DEVIATIONS')}</TableHead>
            <TableHead>{t('TRIPS.TRIP_TABLE.NOTES')}</TableHead>
            <TableHead>{t('TRIPS.TRIP_TABLE.LINKS')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={currentTrips()}>
            {(trip) => (
              <TableRow>
                <TableCell>{d(trip.startedAt, DateFormat.DATETIME)}</TableCell>
                <Show
                  when={dayjs(trip.endedAt).isValid()}
                  fallback={<TableCell></TableCell>}
                >
                  <TableCell>
                    {duration(trip.startedAt, trip.endedAt ?? '')}
                  </TableCell>
                </Show>
                <TableCell>
                  {trip.project} - Trip {trip.sequenceNumber}
                </TableCell>
                <Show when={props.driver}>
                  <TableCell>{trip.driver}</TableCell>
                </Show>
                {/* //TODO: capture remarks & meters of railing captured */}
                <TableCell>remarks</TableCell>
                <TableCell>x meters</TableCell>
                <TableCell>{trip.deviations}</TableCell>
                <TableCell>{trip.noteCount}</TableCell>
                <TableCell>
                  <div class='text-brand-blue-400 flex w-24 flex-col gap-2'>
                    <A href={`/projects/${trip.projectId}/trip/${trip.id}`}>
                      {t('TRIPS.TRIP_TABLE.GO_TO_TRIP')}
                    </A>

                    {/* //TODO: Add link to plan */}
                    <A href=''>{t('TRIPS.TRIP_TABLE.GO_TO_PLAN')}</A>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const Pagination: Component<PaginationProps> = (props) => {
  return (
    <div class='my-4 flex flex-row items-center justify-between gap-2'>
      <Button
        onClick={() => props.setCurrentPage(props.currentPage - 1)}
        disabled={props.currentPage === 1}
        class='h-6 rounded-full px-1'
      >
        <IconChevronLeft class='mr-1 size-5' />
      </Button>

      <Button
        onClick={() => props.setCurrentPage(props.currentPage + 1)}
        disabled={
          props.currentPage === props.totalPages || props.totalPages === 0
        }
        class='h-6 rounded-full px-1'
      >
        <IconChevronRight class='ml-1 size-5' />
      </Button>
    </div>
  );
};

export default TripTable;
