import Header from '@/components/layout/Header';
import Resizable from '@/components/layout/Resizable';
import MapDriverMarker from '@/components/map/MapDriverMarker';
import MapRoot from '@/components/map/MapRoot';
import MapTripPopoverMarker from '@/components/map/MapTripPopoverMarker';
import MapZoomControls from '@/components/map/MapZoomControls';
import BackLink from '@/components/navigation/BackLink';
import { useSubjectPosition } from '@/features/positions';
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
  const userDetails = useUserMutation();
  const position = useSubjectPosition('DRIVER', () => params.id);

  const trips = useTripsByUserQuery(() => params.id);

  const handleUpdateUser = async (user: UpdateUserSchemaValues) => {
    try {
      await userDetails.update.mutateAsync({
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

      <Resizable.Root class='flex flex-1 overflow-hidden'>
        <Resizable.Panel
          as='main'
          class='overflow-y-auto p-2 py-2 max-md:flex-1'
          initialSize={0.6}
          minSize={0.5}
        >
          <BackLink />

          <Show when={user?.data}>
            <h1 class='flex items-center gap-1 pb-2 text-4xl font-bold'>
              {user.data?.fullName}
            </h1>

            <UpdateUserForm
              onSubmit={handleUpdateUser}
              userId={user.data?.id}
              name={user.data?.fullName}
              isError={userDetails.update.isError}
              email={user.data?.email}
              phoneNumber={user.data?.phoneNumber}
            />
          </Show>

          <Show when={trips?.data}>
            <TripTable trips={trips.data ?? []} driver={false} />
          </Show>
        </Resizable.Panel>

        <Resizable.Handle />

        <Resizable.Panel as='aside' class='w-0 max-md:hidden' minSize={0.2}>
          <MapRoot class='relative h-full w-full'>
            <MapZoomControls class='absolute right-2 top-2' />
            <Show when={position.position()}>
              {(pos) => (
                <MapTripPopoverMarker
                  as={MapDriverMarker}
                  position={pos().geometry}
                  heading={pos().heading}
                  fullName={user.data?.fullName ?? ''}
                  tripId={pos().tripId}
                />
              )}
            </Show>
          </MapRoot>
        </Resizable.Panel>
      </Resizable.Root>
    </div>
  );
};

export default UserDetails;
