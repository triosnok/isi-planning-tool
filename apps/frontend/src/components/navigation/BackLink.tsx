import { useTranslations } from '@/features/i18n';
import { A } from '@solidjs/router';
import { IconChevronLeft } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface BackLinkProps {
  /**
   * The URL to navigate to when the back link is clicked.
   * Defaults to '..', which is back one route, not to the previous.
   */
  href?: string;
  /**
   * The text to display in the back link, defaults to 'Back' in the english translation.
   */
  text?: string;
}

const BackLink: Component<BackLinkProps> = (props) => {
  const { t } = useTranslations();
  const href = props.href ?? '..';
  const text = props.text ?? t('NAVIGATION.BACK');

  return (
    <A
      href={href}
      class='flex items-center text-sm text-gray-600 hover:underline dark:text-gray-400'
    >
      <IconChevronLeft class='size-4' />
      <p class='flex-none'>{text}</p>
    </A>
  );
};

export default BackLink;
