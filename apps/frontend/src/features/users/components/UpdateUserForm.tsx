import { Button } from '@/components/ui/button';
import { Callout, CalloutContent, CalloutTitle } from '@/components/ui/callout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SwitchButton } from '@/components/ui/switch-button';
import ErrorLabel from '@/features/error/components/ErrorLabel';
import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { UserRole } from '@isi-insight/client';
import { createForm, setValue, zodForm } from '@modular-forms/solid';
import { Component, Show, createSignal } from 'solid-js';
import { UpdateUserSchema, UpdateUserSchemaValues } from '../api';
import UserRoleRadio from './UserRoleRadio';

export interface UpdateUserFormProps {
  class?: string;
  userId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: UserRole;
  isError?: boolean;
  onSubmit: (values: UpdateUserSchemaValues) => void;
}
const UpdateUserForm: Component<UpdateUserFormProps> = (props) => {
  const { t } = useTranslations();

  const [form, { Form, Field }] = createForm({
    validate: zodForm(UpdateUserSchema),
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

  const handleSubmit = (values: UpdateUserSchemaValues) => {
    props.onSubmit(values);

    if (changePassword()) {
      setValue(form, 'password', '', {
        shouldFocus: false,
        shouldValidate: false,
      });
      setValue(form, 'passwordConfirmation', '', {
        shouldFocus: false,
        shouldValidate: false,
      });
      setChangePassword(false);
      setValue(form, 'changePassword', false);
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
                placeholder={t('USERS.FORM.PASSWORD')}
              />

              <ErrorLabel text={field.error} />
            </>
          )}
        </Field>

        <Field name='passwordConfirmation'>
          {(field, props) => (
            <>
              <Label class='mt-1' for={field.name}>
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

      <Show when={props.isError}>
        <Callout class='mt-2' variant={'error'}>
          <CalloutTitle>Error</CalloutTitle>
          <CalloutContent>
            {t('USERS.FORM.FAILED_TO_UPDATE_USER')}
          </CalloutContent>
        </Callout>
      </Show>

      <Button type='submit' class='mt-2'>
        {t('USERS.FORM.UPDATE_USER')}
      </Button>
    </Form>
  );
};

export default UpdateUserForm;
