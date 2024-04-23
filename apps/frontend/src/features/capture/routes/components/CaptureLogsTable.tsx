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
import { useTranslations } from '@/features/i18n';
import { CaptureLogDetails } from '@isi-insight/client';
import { Component, For, Show, createSignal } from 'solid-js';

export interface CaptureLogsTableProps {
  captureLogs: CaptureLogDetails[];
}

const CaptureLogsTable: Component<CaptureLogsTableProps> = (props) => {
  const { t, d } = useTranslations();

  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 15;

  const currentCaptureLogs = () =>
    props.captureLogs.slice(
      (currentPage() - 1) * itemsPerPage,
      currentPage() * itemsPerPage
    );

  return (
    <>
      <div class='mt-4 flex flex-wrap items-center justify-between gap-2'>
        <Input placeholder={t('NAVIGATION.SEARCH')} class='w-fit' />
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={props.captureLogs.length}
          onPageChange={setCurrentPage}
        />
      </div>

      <Table class='mb-2 mt-2'>
        <TableHeader>
          <TableRow>
            <TableHead>{t('CAPTURE.LOG_IDENTIFIER')}</TableHead>
            <TableHead>{t('GENERAL.UPDATED_AT')}</TableHead>
          </TableRow>
        </TableHeader>
        <Show when={currentCaptureLogs().length === 0}>
          <TableCaption class='pt-4'>
            {t('CAPTURE.TABLE.NO_CAPTURE_LOGS')}
          </TableCaption>
        </Show>
        <TableBody>
          <For each={currentCaptureLogs()}>
            {(captureLog) => (
              <TableRow>
                <TableCell>{captureLog.name}</TableCell>
                <TableCell>{d(captureLog.updatedAt)}</TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
    </>
  );
};

export default CaptureLogsTable;
