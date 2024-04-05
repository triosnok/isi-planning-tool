import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { IconCircleCheckFilled } from '@tabler/icons-solidjs';
import { Component, Show } from 'solid-js';

export interface UserStatusProps {
  status: string;
  class?: string;
}

const UserStatus: Component<UserStatusProps> = (props) => {
  const { t } = useTranslations();

  return (
    <Show when={props.status === 'driving'}>
      <p
        class={cn(
          'text-warning-500 flex items-center gap-0.5 text-sm',
          props.class
        )}
      >
        <IconCircleCheckFilled class='h-4 w-4' />
        <span>{t('USERS.DRIVING')}</span>
      </p>
    </Show>
  );
};

export default UserStatus;
