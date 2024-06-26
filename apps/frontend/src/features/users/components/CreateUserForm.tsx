import Dropzone from '@/components/input/Dropzone';
import { Button } from '@/components/ui/button';
import { Callout, CalloutContent, CalloutTitle } from '@/components/ui/callout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ErrorLabel from '@/features/error/components/ErrorLabel';
import { useFileUploadMutation } from '@/features/file';
import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { UserRole } from '@isi-insight/client';
import { createForm, setValue, zodForm } from '@modular-forms/solid';
import { Component, Show, createSignal } from 'solid-js';
import { CreateUserSchema, CreateUserSchemaValues } from '../api';
import UserRoleRadio from './UserRoleRadio';

export interface CreateUserFormProps {
  class?: string;
  userId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  isError?: boolean;
  onSubmit: (values: CreateUserSchemaValues) => void;
}

const CreateUserForm: Component<CreateUserFormProps> = (props) => {
  const { t } = useTranslations();
  const [form, { Form, Field }] = createForm({
    validate: zodForm(CreateUserSchema),
  });

  const fileUploadQuery = useFileUploadMutation('users');
  const [profilePicture, setProfilePicture] = createSignal<File | undefined>(
    undefined
  );

  const handleSubmit = async (values: CreateUserSchemaValues) => {
    try {
      if (profilePicture()) {
        const image = await fileUploadQuery.mutateAsync(
          profilePicture() as File
        );

        values.imageUrl = image.url;
        setProfilePicture(undefined);
      }

      props.onSubmit(values);
    } catch (error) {
      // ignore
    }
  };

  return (
    <Form
      class={cn('flex flex-col gap-1', props.class)}
      onSubmit={handleSubmit}
    >
      <Field name='fullName'>
        {(field, props) => (
          <>
            <Label for={field.name}>{t('USERS.FORM.NAME')}</Label>

            <Input
              {...props}
              id={field.name}
              type='text'
              value={field.value}
              placeholder={t('USERS.FORM.NAME')}
            />

            <ErrorLabel text={field.error} />
          </>
        )}
      </Field>

      <Field name='email'>
        {(field, props) => (
          <>
            <Label for={field.name} class='mt-2'>
              {t('USERS.FORM.EMAIL')}
            </Label>

            <Input
              {...props}
              type='email'
              value={field.value}
              placeholder={t('USERS.FORM.EMAIL')}
            />

            <ErrorLabel text={field.error} />
          </>
        )}
      </Field>

      <Field name='phoneNumber'>
        {(field, props) => (
          <>
            <Label for={field.name} class='mt-2'>
              {t('USERS.FORM.PHONE_NUMBER')}
            </Label>

            <Input
              {...props}
              type='text'
              value={field.value}
              placeholder={t('USERS.FORM.PHONE_NUMBER')}
            />

            <ErrorLabel text={field.error} />
          </>
        )}
      </Field>

      <Field name='password'>
        {(field, props) => (
          <>
            <Label class='mt-2' for={field.name}>
              {t('USERS.FORM.PASSWORD')}
            </Label>
            <Input
              {...props}
              type='password'
              value={field.value}
              placeholder={t('USERS.FORM.PASSWORD')}
            />

            <ErrorLabel text={field.error} />
          </>
        )}
      </Field>
      <Field name='passwordConfirmation'>
        {(field, props) => (
          <>
            <Label class='mt-2' for={field.name}>
              {t('USERS.FORM.CONFIRM_PASSWORD')}
            </Label>
            <Input
              {...props}
              type='password'
              value={field.value}
              placeholder={t('USERS.FORM.CONFIRM_PASSWORD')}
            />

            <ErrorLabel text={field.error} />
          </>
        )}
      </Field>

      <Field name='role'>
        {(field, props) => (
          <>
            <Label for={field.name} class='mt-2'>
              {t('USERS.FORM.ROLE')}
            </Label>

            <UserRoleRadio
              value={field.value}
              onChange={(v) => setValue(form, 'role', v)}
            />

            <ErrorLabel text={field.error} />
          </>
        )}
      </Field>

      <label for='profilePicture'>
        <Dropzone
          name='profilePicture'
          title={t('USERS.FORM.DROP_IMAGE_HERE') || ''}
          onChange={setProfilePicture}
          value={profilePicture()}
          class='mt-2'
        />
      </label>

      <Show when={props.isError}>
        <Callout class='mt-2' variant={'error'}>
          <CalloutTitle>Error</CalloutTitle>
          <CalloutContent>
            {t('USERS.FORM.FAILED_TO_CREATE_USER')}
          </CalloutContent>
        </Callout>
      </Show>

      <Button type='submit' class='mt-auto'>
        {t('USERS.FORM.CREATE_USER')}
      </Button>
    </Form>
  );
};

export default CreateUserForm;
