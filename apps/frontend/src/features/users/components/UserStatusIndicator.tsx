import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { UserStatus } from '@isi-insight/client';
import { IconCircleCheckFilled, IconSteeringWheel } from '@tabler/icons-solidjs';
import { Component, Match, Switch } from 'solid-js';

export interface UserStatusProps {
  status: UserStatus;
  class?: string;
}

const UserStatusIndicator: Component<UserStatusProps> = (props) => {
  const { t } = useTranslations();

  return (
    <Switch>
      <Match when={props.status === 'DRIVING'}>
        <p
          class={cn(
            'text-warning-500 flex items-center gap-0.5 text-sm font-medium',
            props.class
          )}
        >
          <IconSteeringWheel class='size-4' />
          <span>{t('USERS.DRIVING')}</span>
        </p>
      </Match>

      <Match when={props.status === 'AVAILABLE'}>
        <p
          class={cn(
            'text-success-500 flex items-center gap-0.5 text-sm font-medium',
            props.class
          )}
        >
          <IconCircleCheckFilled class='size-4' />
          <span>{t('GENERAL.STATUSES.AVAILABLE')}</span>
        </p>
      </Match>
    </Switch>
  );
};

export default UserStatusIndicator;
