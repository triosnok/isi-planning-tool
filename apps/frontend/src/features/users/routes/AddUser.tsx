import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerHeader,
} from '@/components/ui/side-drawer';
import { useTranslations } from '@/features/i18n';
import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import { CreateUserSchemaValues, useUserMutation } from '../api';
import CreateUserForm from '../components/CreateUserForm';

const AddUser: Component = () => {
  const { t } = useTranslations();
  const { create } = useUserMutation();
  const navigate = useNavigate();

  const handleSubmit = async (values: CreateUserSchemaValues) => {
    try {
      await create.mutateAsync(values);
      navigate('/users');
    } catch (error) {
      console.error('Failed to create user');
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      navigate('/users');
    }
  };

  return (
    <SideDrawer open onOpenChange={handleClose}>
      <SideDrawerContent class='flex flex-col'>
        <SideDrawerHeader>
          <h2 class='text-2xl font-bold'>{t('USERS.ADD_USER')}</h2>
        </SideDrawerHeader>

        <CreateUserForm onSubmit={handleSubmit} class='flex-1' />
      </SideDrawerContent>
    </SideDrawer>
  );
};

export default AddUser;
