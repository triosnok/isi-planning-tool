import Header from '@/components/layout/Header';
import { Component, Show } from 'solid-js';
import {
  CaptureLogSchemaValues,
  useCaptureLogsQuery,
  useUploadCaptureLog,
} from '../api';
import CaptureLogsTable from './components/CaptureLogsTable';
import UploadCaptureLogsForm from './components/UploadCaptureLogsForm';

const Capture: Component = () => {
  const capture = useUploadCaptureLog();
  const captureLogs = useCaptureLogsQuery();

  const handleSubmit = async (values: CaptureLogSchemaValues) => {
    try {
      await capture.mutateAsync(values);
    } catch (error) {
      console.error('Failed to upload capture log');
    }
  };

  return (
    <div class='flex h-full w-full flex-col'>
      <Header />

      <section class='px-6 py-4'>
        <h1 class='text-4xl font-bold'>Capture logs</h1>

        <div class='flex flex-col lg:flex-row'>
          <main class='flex-1'>
            <Show when={captureLogs?.data}>
              <CaptureLogsTable captureLogs={captureLogs.data ?? []} />
            </Show>
          </main>
          <aside class='order-first lg:order-last lg:w-1/3 lg:pl-6'>
            <UploadCaptureLogsForm onSubmit={handleSubmit} />
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Capture;
