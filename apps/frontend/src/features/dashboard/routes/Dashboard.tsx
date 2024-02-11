import { useProfile } from '@/features/auth/api';
import { Component } from 'solid-js';
import Header from '@/components/layout/Header';

const Dashboard: Component = () => {
  const profile = useProfile();

  return (
    <>
      <Header />
      <main>
        <h1>Dashboard {profile.data}</h1>
      </main>
    </>
  );
};

export default Dashboard;
