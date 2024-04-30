import Header from '@/components/layout/Header';
import MapRoot from '@/components/map/MapRoot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/features/i18n';
import { LayoutProps } from '@/lib/utils';
import { useNavigate } from '@solidjs/router';
import { Component, For, Index } from 'solid-js';
import { useUsersQuery } from '../api';
import UserCard from '../components/UserCard';
import { usePositions } from '@/features/positions';
import MapDriverLayer from '@/components/map/MapDriverLayer';

const UserOverview: Component<LayoutProps> = (props) => {
  const users = useUsersQuery();
  const navigate = useNavigate();
  const { t } = useTranslations();
  const handleAddUser = () => navigate('/users/new');
  const { positions } = usePositions('DRIVER');

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <div class='flex flex-1'>
        <main class='flex-1 px-6 py-4'>
          <h1 class='text-4xl font-bold'>{t('USERS.TITLE')}</h1>

          <section class='flex flex-col justify-between gap-2 sm:flex-row'>
            <Input placeholder={t('NAVIGATION.SEARCH')} class='w-fit' />
            <Button onClick={handleAddUser} class='ml-auto w-full sm:w-auto'>
              {t('USERS.ADD_USER')}
            </Button>
          </section>

          <section class='mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
            <For each={users.data}>
              {(user) => (
                <UserCard
                  imageUrl='placeholder'
                  name={user.fullName}
                  email={user.email}
                  phoneNumber={user.phoneNumber}
                  status='driving'
                  role={user.role}
                  onDetailsClick={() => navigate(`/users/${user.id}`)}
                  class='min-w-48'
                />
              )}
            </For>
          </section>
        </main>

        <aside class='w-0 md:w-1/3'>
          <MapRoot class='h-full w-full'>
            <Index each={positions()}>
              {(pos) => (
                <MapDriverLayer
                  position={pos().geometry}
                  heading={pos().heading}
                  fullName='Test User'
                />
              )}
            </Index>
          </MapRoot>
        </aside>

        {props.children}
      </div>
    </div>
  );
};

export default UserOverview;
