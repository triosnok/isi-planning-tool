import Header from '@/components/layout/Header';
import { Component, Show } from 'solid-js';
import {
  CaptureLogSchemaValues,
  useCaptureLogsQuery,
  useUploadCaptureLog,
} from '../api';
import CaptureLogsTable from './components/CaptureLogsTable';
import UploadCaptureLogsForm from './components/UploadCaptureLogsForm';
import { useTranslations } from '@/features/i18n';

const CaptureOverview: Component = () => {
  const capture = useUploadCaptureLog();
  const captureLogs = useCaptureLogsQuery();
  const { t } = useTranslations();

  const handleSubmit = async (values: CaptureLogSchemaValues) => {
    try {
      await capture.mutateAsync(values);
    } catch (error) {
      console.error('Failed to upload capture log');
    }
  };

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <section class='flex-1 overflow-y-auto px-6 py-4 flex flex-col'>
        <h1 class='text-4xl font-bold'>{t('CAPTURE.CAPTURE_LOGS')}</h1>

        <div class='flex flex-1 max-lg:flex-col'>
          <main class='flex-1'>
            <Show when={captureLogs?.data}>
              <CaptureLogsTable captureLogs={captureLogs.data ?? []} />
            </Show>
          </main>

          <aside class='max-lg:order-first lg:w-1/3 lg:pl-6 relative'>
            <UploadCaptureLogsForm
              isLoading={capture.isPending}
              onSubmit={handleSubmit}
              class='h-full'
            />
          </aside>
        </div>
      </section>
    </div>
  );
};

export default CaptureOverview;
