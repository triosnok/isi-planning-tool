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

  return (
    <div>
      <div class='flex flex-row items-center justify-between'>
        <Input placeholder={t('NAVIGATION.SEARCH')} class='mt-4 w-fit' />
        <div class='flex flex-row justify-end gap-2 pr-8 pt-4'>
          <div class='my-4 flex flex-row items-center justify-center gap-2'>
            <p>{itemRange()}</p>
            <Button
              onClick={() => setCurrentPage(currentPage() - 1)}
              disabled={currentPage() === 1}
              class='h-8 rounded-2xl px-1'
            >
              <IconChevronLeft class='size-6' />
            </Button>

            <Button
              onClick={() => setCurrentPage(currentPage() + 1)}
              disabled={currentPage() === totalPages()}
              class='h-8 rounded-2xl px-1'
            >
              <IconChevronRight class='size-6' />
            </Button>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('TRIPS.TRIP_TABLE.START')}</TableHead>
            <TableHead>{t('TRIPS.TRIP_TABLE.STOP')}</TableHead>
            <TableHead>{t('TRIPS.TRIP_TABLE.NAME')}</TableHead>
            <Show when={props.driver}>
              <TableHead>{t('TRIPS.TRIP_TABLE.DRIVER')}</TableHead>
            </Show>
            <TableHead>{t('TRIPS.TRIP_TABLE.CAPTURE_REMARKS')}</TableHead>
            <TableHead>
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

                {/* //TODO: ended at in hours / minutes */}
                <TableCell>{trip.endedAt}</TableCell>
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
                      Go to trip
                    </A>

                    {/* //TODO: Add link to plan */}
                    <A href=''>Go to plan</A>
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

export default TripTable;
