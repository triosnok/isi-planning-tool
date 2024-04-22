import Header from '@/components/layout/Header';
import MapRoot from '@/components/map/MapRoot';
import BackLink from '@/components/navigation/BackLink';
import TripTable from '@/features/trips/components/TripTable';
import { useParams } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import {
  UpdateUserSchemaValues,
  useTripsByUserQuery,
  useUserDetailsQuery,
  useUserMutation,
} from '../api';
import UpdateUserForm from '../components/UpdateUserForm';

const UserDetails: Component = () => {
  const params = useParams();
  const user = useUserDetailsQuery(params.id);
  const { update } = useUserMutation();

  const trips = useTripsByUserQuery(() => params.id);

  const handleUpdateUser = async (user: UpdateUserSchemaValues) => {
    try {
      await update.mutateAsync({
        userId: params.id,
        ...user,
      });
    } catch (error) {
      console.error('Failed to update user');
    }
  };

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <div class='flex flex-1 overflow-hidden'>
        <main class='flex-1 overflow-y-auto p-2 py-2'>
          <BackLink />

          <Show when={user?.data}>
            <h1 class='flex items-center gap-1 pb-2 text-4xl font-bold'>
              {user.data?.fullName}
            </h1>

            <UpdateUserForm
              onSubmit={handleUpdateUser}
              userId={user.data?.id}
              name={user.data?.fullName}
              email={user.data?.email}
              phoneNumber={user.data?.phoneNumber}
            />
          </Show>

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
