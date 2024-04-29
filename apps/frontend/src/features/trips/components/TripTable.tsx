import Pagination from '@/components/navigation/Pagination';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DateFormat, useTranslations } from '@/features/i18n';
import { TripDetails } from '@isi-insight/client';
import { A } from '@solidjs/router';
import dayjs from 'dayjs';
import { Component, For, Show, createSignal } from 'solid-js';

export interface TripTableProps {
  trips: TripDetails[];
  driver?: boolean;
}

const TripTable: Component<TripTableProps> = (props) => {
  const { t, d } = useTranslations();

  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;
  const currentTrips = () =>
    props.trips.slice(
      (currentPage() - 1) * itemsPerPage,
      currentPage() * itemsPerPage
    );

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
    <>
      <div class='mt-4 flex flex-wrap items-center justify-between gap-2'>
        <Input placeholder={t('NAVIGATION.SEARCH')} class='w-fit' />
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={props.trips.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <Table class='mb-2 mt-2'>
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
        <Show when={currentTrips().length === 0}>
          <TableCaption class='pt-4'>
            {t('TRIPS.TRIP_TABLE.NO_TRIPS_AVAILABLE')}
          </TableCaption>
        </Show>
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
                  {trip.project} - {t('TRIPS.TRIP')} {trip.sequenceNumber}
                </TableCell>
                <Show when={props.driver}>
                  <TableCell>{trip.driver}</TableCell>
                </Show>
                {/* //TODO: meters of railing captured */}
                <TableCell>
                  {trip?.captureDetails?.imageAnalysis.remarks || ''}
                </TableCell>
                <TableCell>x meters</TableCell>
                <TableCell>{trip.deviations}</TableCell>
                <TableCell>{trip.noteCount}</TableCell>
                <TableCell>
                  <div class='text-brand-blue-400 flex w-24 flex-col gap-2'>
                    <A href={`/projects/${trip.projectId}/trip/${trip.id}`}>
                      {t('TRIPS.TRIP_TABLE.GO_TO_TRIP')}
                    </A>
                    <A
                      href={`/projects/${trip.projectId}?plans=${trip.projectPlanId}`}
                    >
                      {t('TRIPS.TRIP_TABLE.GO_TO_PLAN')}
                    </A>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
    </>
  );
};

export default TripTable;
