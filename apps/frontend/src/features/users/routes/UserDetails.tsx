import Header from '@/components/layout/Header';
import { A, useNavigate, useParams } from '@solidjs/router';
import { IconChevronLeft } from '@tabler/icons-solidjs';
import { Component, Show } from 'solid-js';
import {
  UserSchemaValues,
  useUserDetailsQuery,
  useUserMutation,
  useTripsByUserQuery,
} from '../api';
import UserForm from '../components/UserForm';
import BackLink from '@/components/navigation/BackLink';
import TripTable from '@/features/trips/components/TripTable';
import { useTranslations } from '@/features/i18n';
import MapRoot from '@/components/map/MapRoot';

const UserDetails: Component = () => {
  const params = useParams();
  const user = useUserDetailsQuery(params.id);
  const { update } = useUserMutation();
  const { t } = useTranslations();
  const navigate = useNavigate();

  const trips = useTripsByUserQuery(params.id);

  const handleUpdateUser = async (user: UserSchemaValues) => {
    try {
      await update.mutateAsync({
        userId: params.id,
        ...user,
      });
      navigate('/users');
    } catch (error) {
      console.error('Failed to update user');
    }
  };

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <div class='flex flex-1'>
        <main class='flex-1 px-6 pb-4 pt-2'>
          <BackLink />

          <h1 class='flex items-center gap-1 text-4xl font-bold'>
            {user.data?.fullName}
          </h1>

          <UserForm
            onSubmit={handleUpdateUser}
            userId={user.data?.id}
            name={user.data?.fullName}
            email={user.data?.email}
            phoneNumber={user.data?.phoneNumber}
          />

          <Show when={trips?.data}>
            <TripTable trips={trips.data ?? []} driver={true} />
          </Show>
        </main>

        <aside class='w-0 md:w-1/3'>
          <MapRoot class='h-full w-full' />
        </aside>
      </div>
    </div>
  );
};

export default UserDetails;
