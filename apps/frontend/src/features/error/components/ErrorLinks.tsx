import { useTranslations } from '@/features/i18n';
import { A } from '@solidjs/router';
import { IconArrowBack } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

const ErrorLinks: Component = () => {
  const { t } = useTranslations();

  return (
    <div class='flex divide-x-2 divide-gray-300 dark:divide-gray-700'>
      <A href='..' class='-ml-1.5 flex items-center gap-1 font-medium'>
        <IconArrowBack class='h-5 w-5' />
        <span class='text-sm uppercase'>{t('NAVIGATION.BACK')}</span>
      </A>
    </div>
  );
};

export default ErrorLinks;
