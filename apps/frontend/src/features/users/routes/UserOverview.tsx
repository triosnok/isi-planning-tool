import Header from '@/components/layout/Header';
import Resizable from '@/components/layout/Resizable';
import MapDriverMarker from '@/components/map/MapDriverMarker';
import MapRoot from '@/components/map/MapRoot';
import MapTripPopover from '@/components/map/MapTripPopover';
import MapZoomControls from '@/components/map/MapZoomControls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTranslations } from '@/features/i18n';
import { usePositions } from '@/features/positions';
import { LayoutProps } from '@/lib/utils';
import { useNavigate } from '@solidjs/router';
import { Component, For, Index } from 'solid-js';
import { useUsersQuery } from '../api';
import UserCard from '../components/UserCard';

const UserOverview: Component<LayoutProps> = (props) => {
  const users = useUsersQuery();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const handleAddUser = () => navigate('/users/new');
  const { positions } = usePositions('DRIVER');

  const userMap = () => {
    const list = users.data;
    const map = new Map<string, string>();

    for (const user of list ?? []) {
      map.set(user.id, user.fullName);
    }

    return map;
  };

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <Resizable.Root class='isolate flex flex-1 overflow-hidden'>
        <Resizable.Panel
          as='main'
          class='overflow-y-auto px-6 py-4 max-md:flex-1'
          minSize={0.265}
          initialSize={0.7}
        >
          <h1 class='text-4xl font-bold'>{t('USERS.TITLE')}</h1>

          <section class='flex flex-col justify-between gap-2 sm:flex-row'>
            <Input placeholder={t('NAVIGATION.SEARCH')} class='w-fit' />
            <Button onClick={handleAddUser} class='ml-auto w-full sm:w-auto'>
              {t('USERS.ADD_USER')}
            </Button>
          </section>

          <section class='mt-2 grid grid-cols-[repeat(auto-fill,_minmax(14rem,_1fr))] gap-2'>
            <For each={users.data}>
              {(user) => (
                <UserCard
                  imageUrl='placeholder'
                  name={user.fullName}
                  email={user.email}
                  phoneNumber={user.phoneNumber}
                  status={user.status}
                  role={user.role}
                  onDetailsClick={() => navigate(`/users/${user.id}`)}
                />
              )}
            </For>
          </section>
        </Resizable.Panel>

        <Resizable.Handle />

        <Resizable.Panel
          as='aside'
          class='max-md:hidden'
          initialSize={0.3}
          minSize={0.2}
        >
          <MapRoot class='relative h-full w-full'>
            <Index each={positions()}>
              {(pos) => (
                <Popover>
                  <PopoverTrigger
                    as={(props) => (
                      <MapDriverMarker
                        {...props}
                        position={pos().geometry}
                        heading={pos().heading}
                        fullName={userMap().get(pos().driverId) ?? ''}
                      />
                    )}
                  />
                  <PopoverContent>
                    <MapTripPopover tripId={pos().tripId} />
                  </PopoverContent>
                </Popover>
              )}
            </Index>
            <MapZoomControls class='absolute right-2 top-2' />
          </MapRoot>
        </Resizable.Panel>

        {props.children}
      </Resizable.Root>
    </div>
  );
};

export default UserOverview;
