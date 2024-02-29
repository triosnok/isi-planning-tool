import { useTranslations } from '@/features/i18n';
import { Component } from 'solid-js';
import ErrorCode from '../components/ErrorCode';
import ErrorLinks from '../components/ErrorLinks';

const NotFound: Component = () => {
  const { t } = useTranslations();

  return (
    <main class='flex h-svh w-svw flex-col items-center justify-center'>
      <ErrorCode code={404} text='NOT FOUND' />

      <p class='my-2'>{t('ERROR.PAGE_NOT_FOUND')}</p>

      <ErrorLinks />
    </main>
  );
};

export default NotFound;
