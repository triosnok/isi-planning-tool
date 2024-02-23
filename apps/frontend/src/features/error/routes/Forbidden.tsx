import { useTranslations } from '@/features/i18n';
import { Component } from 'solid-js';
import ErrorCode from '../components/ErrorCode';
import ErrorLinks from '../components/ErrorLinks';

const Forbidden: Component = () => {
  const { t } = useTranslations();
  return (
    <main class='flex h-svh w-svw flex-col items-center justify-center'>
      <ErrorCode code={403} text='FORBIDDEN' />

      <p class='my-2'>{t('ERROR.FORBIDDEN')}</p>

      <ErrorLinks />
    </main>
  );
};

export default Forbidden;
