import Header from '@/components/layout/Header';
import { A, useParams } from '@solidjs/router';
import { IconChevronLeft } from '@tabler/icons-solidjs';
import { Component, Show } from 'solid-js';
import { UserSchemaValues, useUserDetailsQuery, useUserMutation } from '../api';
import UserForm from '../components/UserForm';
import BackLink from '@/components/navigation/BackLink';

const UserDetails: Component = () => {
  const r = useParams();
  const user = useUserDetailsQuery(r.id);
  const { update } = useUserMutation();

  const handleUpdateUser = async (user: UserSchemaValues) => {
    try {
      await update.mutateAsync({
        userId: r.id,
        ...user,
      });
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

          <Show when={user.data}>
            <UserForm
              onSubmit={handleUpdateUser}
              userId={user.data?.id}
              name={user.data?.fullName}
              email={user.data?.email}
              phoneNumber={user.data?.phoneNumber}
            />
          </Show>
        </main>
      </div>
    </div>
  );
};

export default UserDetails;
