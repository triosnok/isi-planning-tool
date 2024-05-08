import { Button } from '@/components/ui/button';
import { useTranslations } from '@/features/i18n';
import { IconType, cn } from '@/lib/utils';
import { UserRole, UserStatus } from '@isi-insight/client';
import { IconMail, IconPhone, IconPhotoX } from '@tabler/icons-solidjs';
import { Component, Show } from 'solid-js';
import UserStatusIndicator from './UserStatusIndicator';
import IconProperty from '@/components/IconProperty';

export interface UserCardProps {
  imageUrl?: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  onDetailsClick?: () => void;
  class?: string;
}

const UserCard: Component<UserCardProps> = (props) => {
  const { t } = useTranslations();

  return (
    <div
      class={cn(
        'overflow-hidden rounded-md border pt-2 dark:border-gray-800',
        props.class
      )}
    >
      <Show
        when={props.imageUrl}
        fallback={
          <div class='m-auto flex size-24 flex-col items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'>
            <IconPhotoX class='h-7 w-7' />
            <span class='text-xs uppercase'>{t('GENERAL.NO_IMAGE')}</span>
          </div>
        }
      >
        <img
          class='m-auto size-24 rounded-full'
          src='https://placehold.co/400x400/png'
        />
      </Show>

      <div class='m-2 flex flex-col'>
        <p class='self-center text-xs text-gray-500'>{props.role}</p>
        <h2 class='self-center truncate text-xl font-semibold'>{props.name}</h2>

        <UserStatusIndicator status={props.status} class='self-center' />

        <hr class='my-1 h-px w-full border-0 bg-gray-300 dark:bg-gray-700' />

        <IconProperty icon={IconMail} text={props.email} />
        <IconProperty icon={IconPhone} text={props.phoneNumber} />
      </div>

      <Button
        type='button'
        onClick={props.onDetailsClick}
        class='h-fit w-full rounded-none py-1'
      >
        {t('USERS.VIEW_DRIVER_LOG')}
      </Button>
    </div>
  );
};

export default UserCard;
