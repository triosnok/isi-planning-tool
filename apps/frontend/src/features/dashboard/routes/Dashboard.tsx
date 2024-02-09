import { Button } from '@/components/ui/button';
import { useProfile, useSignOutMutation } from '@/features/auth/api';
import { Component } from 'solid-js';

const Dashboard: Component = () => {
  const profile = useProfile();
  const signOut = useSignOutMutation();

  return (
    <>
      <h1>Dashboard {profile.data}</h1>
      <Button onClick={() => signOut.mutateAsync()}>Sign out</Button>
    </>
  );
};

export default Dashboard;
