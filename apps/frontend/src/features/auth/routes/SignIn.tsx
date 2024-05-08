import Logo from '@/components/logo/Logo';
import { Button } from '@/components/ui/button';
import { Callout, CalloutContent, CalloutTitle } from '@/components/ui/callout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ErrorLabel from '@/features/error/components/ErrorLabel';
import { useTranslations } from '@/features/i18n';
import { SubmitHandler, createForm, zodForm } from '@modular-forms/solid';
import { A, useNavigate } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import { z } from 'zod';
import { useSignInMutation } from '../api';

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type SignInForm = z.infer<typeof SignInSchema>;

const SignIn: Component = () => {
  const { t } = useTranslations();
  const [, { Form, Field }] = createForm({ validate: zodForm(SignInSchema) });
  const navigate = useNavigate();
  const signIn = useSignInMutation();

  const handleSubmit: SubmitHandler<SignInForm> = async (values) => {
    try {
      await signIn.mutateAsync(values);
      navigate('/');
    } catch (error) {
      // ignored
    }
  };

  return (
    <div class='flex h-screen items-center justify-center'>
      <main class='flex w-full max-w-md flex-col items-center justify-center rounded-lg border border-gray-100 py-6 shadow-lg dark:border-gray-800 dark:bg-gray-900'>
        <Logo class='h-28' />

        <Form
          id='sign-in-form'
          class='flex w-full flex-col gap-2 px-4'
          onSubmit={handleSubmit}
        >
          <h1 class='font-title mt-2 text-center text-xl font-semibold'>
            {t('AUTHENTICATION.SIGN_IN_TO')} inSight
          </h1>

          <Field name='email'>
            {(field, props) => (
              <>
                <Label for={field.name} class='font-semibold'>
                  {t('USERS.FORM.EMAIL')}
                </Label>
                <Input
                  {...props}
                  type='email'
                  id='email'
                  placeholder={t('USERS.FORM.EMAIL')}
                  value={field.value}
                />
                <ErrorLabel text={field.error} />
              </>
            )}
          </Field>

          <Field name='password'>
            {(field, props) => (
              <>
                <Label for='password' class='font-semibold'>
                  {t('USERS.FORM.PASSWORD')}
                </Label>
                <Input
                  {...props}
                  type='password'
                  id='password'
                  placeholder={t('USERS.FORM.PASSWORD')}
                  value={field.value}
                />
                <ErrorLabel text={field.error} />
              </>
            )}
          </Field>

          <div class='flex justify-end'>
            <A class='text-sm hover:underline' href='/forgot-password'>
              {t('AUTHENTICATION.FORGOT_PASSWORD')}
            </A>
          </div>

          <Show when={signIn.error}>
            <Callout variant={'error'}>
              <CalloutTitle>Error</CalloutTitle>
              <CalloutContent>
                {t('AUTHENTICATION.INCORRECT_PASSWORD')}
              </CalloutContent>
            </Callout>
          </Show>

          <Button loading={signIn.isPending} class='mt-4'>
            {t('AUTHENTICATION.SIGN_IN')}
          </Button>
        </Form>
      </main>
    </div>
  );
};

export default SignIn;
