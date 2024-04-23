import Header from '@/components/layout/Header';
import { Component } from 'solid-js';
import { useUploadCaptureLog } from '../api';
import UploadCaptureLogsForm from './components/UploadCaptureLogsForm';

const Capture: Component = () => {
  const capture = useUploadCaptureLog();

  const handleSubmit = async (values: any) => {
    await capture.mutateAsync(values);
  };

  return (
    <>
      <Header />
      <main class='gap-8 px-6 py-2'>
        <UploadCaptureLogsForm onSubmit={handleSubmit} />
      </main>
    </>
  );
};

export default Capture;
