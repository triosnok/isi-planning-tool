import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SwitchButton } from '@/components/ui/switch-button';
import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { UserRole } from '@isi-insight/client';
import { createForm, setValue, zodForm } from '@modular-forms/solid';
import { Component, Show, createSignal } from 'solid-js';
import { UserSchema, UserSchemaValues } from '../api';
import UserRoleRadio from './UserRoleRadio';

export interface UserFormProps {
  class?: string;
  userId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  onSubmit: (values: UserSchemaValues) => void;
}

const UserForm: Component<UserFormProps> = (props) => {
  const { t } = useTranslations();
  const [form, { Form, Field }] = createForm({
    validate: zodForm(UserSchema),
    initialValues: {
      userId: props.userId,
      fullName: props.name,
      email: props.email,
      phoneNumber: props.phoneNumber ?? undefined,
      changePassword: false,
      role: props.role,
    },
  });

  const [changePassword, setChangePassword] = createSignal(false);

  const handleSubmit = (values: UserSchemaValues) => {
    props.onSubmit(values);

    if (changePassword()) {
      setValue(form, 'password', '', { shouldFocus: false });
      setValue(form, 'passwordConfirmation', '', { shouldFocus: false });
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
              placeholder='Name'
            />
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
              placeholder='E-mail'
            />
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
              placeholder='Phone number'
            />
          </>
        )}
      </Field>

      <Field name='changePassword' type='boolean'>
        {(field) => (
          <div class='mt-2 flex items-center'>
            <SwitchButton
              checked={field.value ?? false}
              onChange={(v) => {
                setChangePassword(v);
                setValue(form, 'changePassword', v);
              }}
            />

            <Label for={field.name}>{t('USERS.FORM.CHANGE_PASSWORD')}</Label>
          </div>
        )}
      </Field>

      <Show when={changePassword()}>
        <Field name='password'>
          {(field, props) => (
            <>
              <Label for={field.name} class='mt-2'>
                {t('USERS.FORM.PASSWORD')}
              </Label>

              <Input
                {...props}
                type='password'
                value={field.value}
                placeholder='Password'
              />
            </>
          )}
        </Field>

        <Field name='passwordConfirmation'>
          {(field, props) => (
            <>
              <Label for={field.name} class='mt-2'>
                {t('USERS.FORM.CONFIRM_PASSWORD')}
              </Label>

              <Input
                {...props}
                type='password'
                value={field.value}
                placeholder='Confirm password'
              />
            </>
          )}
        </Field>
      </Show>

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
          </>
        )}
      </Field>

      <Button type='submit' class='mt-auto'>
        <Show when={props.userId} fallback={t('USERS.FORM.CREATE_USER')}>
          {t('USERS.FORM.UPDATE_USER')}
        </Show>
      </Button>
    </Form>
  );
};

export default UserForm;
