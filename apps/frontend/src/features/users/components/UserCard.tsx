import { Button } from '@/components/ui/button';
import { useTranslations } from '@/features/i18n';
import { IconType, cn } from '@/lib/utils';
import { IconPhone, IconPhotoX, IconMail } from '@tabler/icons-solidjs';
import { Component, Show } from 'solid-js';
import UserStatus from './UserStatus';

export interface UserCardProps {
  imageUrl?: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  onDetailsClick?: () => void;
  class?: string;
}

const UserCard: Component<UserCardProps> = (props) => {
  const { t } = useTranslations();

  return (
    <div
      class={cn(
        'overflow-hidden rounded-md border py-2 dark:border-gray-800',
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

        <UserStatus status={props.status} class='self-center' />

        <hr class='my-1 h-px w-full border-0 bg-gray-300 dark:bg-gray-700' />

        <UserDetail icon={IconPhone} text={props.email} />
        <UserDetail icon={IconMail} text={props.phoneNumber} />
      </div>

      <Show when={props.role === 'driver'}>
        <Button
          type='button'
          onClick={props.onDetailsClick}
          class='h-fit w-full rounded-none py-1'
        >
          {t('USERS.VIEW_DRIVER_LOG')}
        </Button>
      </Show>
    </div>
  );
};

interface UserDetailProps {
  icon: IconType;
  text: string;
}

const UserDetail: Component<UserDetailProps> = (props) => {
  return (
    <p class='flex items-center gap-1 text-sm text-gray-800 dark:text-gray-300'>
      <props.icon class='h-5 w-5 text-gray-500' />
      <span class='truncate'>{props.text}</span>
    </p>
  );
};

export default UserCard;
