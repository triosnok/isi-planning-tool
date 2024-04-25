import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ErrorLabel from '@/features/error/components/ErrorLabel';
import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { UserRole } from '@isi-insight/client';
import { createForm, setValue, zodForm } from '@modular-forms/solid';
import { Component } from 'solid-js';
import { CreateUserSchema, CreateUserSchemaValues } from '../api';
import UserRoleRadio from './UserRoleRadio';

export interface CreateUserFormProps {
  class?: string;
  userId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  onSubmit: (values: CreateUserSchemaValues) => void;
}

const CreateUserForm: Component<CreateUserFormProps> = (props) => {
  const { t } = useTranslations();
  const [form, { Form, Field }] = createForm({
    validate: zodForm(CreateUserSchema),
  });

  const handleSubmit = (values: CreateUserSchemaValues) => {
    props.onSubmit(values);
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
      <Button type='submit' class='mt-auto'>
        {t('USERS.FORM.CREATE_USER')}
      </Button>
    </Form>
  );
};

export default CreateUserForm;
