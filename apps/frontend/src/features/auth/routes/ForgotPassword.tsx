import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/features/i18n';
import { createForm, zodForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { Component, Match, Switch, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { z } from 'zod';
import { useForgotPasswordMutation } from '../api';

interface ForgotPasswordState {
  step: Step;
  email: string;
  resetCode?: string;
}

enum Step {
  SEND_CODE,
  CONFIRM_CODE,
  RESET_PASSWORD,
}

const ForgotPassword: Component = () => {
  const navigate = useNavigate();
  const [store, setStore] = createStore<ForgotPasswordState>({
    step: Step.SEND_CODE,
    email: '',
    resetCode: undefined,
  });

  return (
    <div class='flex h-svh w-svw items-center justify-center'>
      <main class='m-4 flex w-full max-w-md flex-col rounded-md bg-gray-900 p-4'>
        <Switch>
          <Match when={store.step === Step.SEND_CODE}>
            <SendCodeStep
              email={store.email}
              onSuccess={(email) => {
                setStore('step', Step.CONFIRM_CODE);
                setStore('email', email);
              }}
            />
          </Match>

          <Match when={store.step === Step.CONFIRM_CODE}>
            <ConfirmCodeStep
              email={store.email}
              onSuccess={(resetCode) => {
                setStore('step', Step.RESET_PASSWORD);
                setStore('resetCode', resetCode);
              }}
            />
          </Match>

          <Match when={store.step === Step.RESET_PASSWORD}>
            <ResetPasswordStep
              email={store.email}
              resetCode={store.resetCode}
              onSuccess={() => navigate('/sign-in')}
            />
          </Match>
        </Switch>
      </main>
    </div>
  );
};

interface StepProps<T> {
  email: string;
  resetCode?: string;
  onSuccess: (v: T) => void;
}

const SendCodeSchema = z.object({ email: z.string().email() });

const SendCodeStep: Component<StepProps<string>> = (props) => {
  const { t } = useTranslations();
  const { sendCode } = useForgotPasswordMutation();
  const [_form, { Field, Form }] = createForm({
    validate: zodForm(SendCodeSchema),
  });

  const handleSubmit = async (values: z.infer<typeof SendCodeSchema>) => {
    await sendCode.mutateAsync(values);
    props.onSuccess(values.email);
  };

  return (
    <Form onSubmit={handleSubmit} class='flex flex-col gap-2'>
      <Field name='email'>
        {(field, props) => (
          <>
            <Label>{t('USERS.FORM.EMAIL')}</Label>
            <Input {...props} value={field.value} />
          </>
        )}
      </Field>

      <Button type='submit'>Send code</Button>
    </Form>
  );
};

const ConfirmCodeStep: Component<StepProps<string>> = (props) => {
  const { t } = useTranslations();
  const { confirmCode } = useForgotPasswordMutation();

  const [code, setCode] = createSignal('');

  const handleSubmit = async () => {
    try {
      const resetCode = await confirmCode.mutateAsync({
        email: props.email,
        code: code(),
      });

      props.onSuccess(resetCode);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div class='flex flex-col gap-2'>
        <Label>{t('AUTHENTICATION.RESET_PASSWORD.CONFIRMATION_CODE')}</Label>

        <Input value={code()} onChange={(e) => setCode(e.target.value)} />

        <Button onClick={handleSubmit}>Confirm code</Button>
      </div>
    </>
  );
};

const ResetSchema = z
  .object({
    password: z.string(),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'PASSWORDS_DO_NOT_MATCH',
  });

const ResetPasswordStep: Component<StepProps<void>> = (props) => {
  const { t } = useTranslations();
  const { resetPassword } = useForgotPasswordMutation();
  const [_form, { Field, Form }] = createForm({
    validate: zodForm(ResetSchema),
  });

  const handleSubmit = async (values: z.infer<typeof ResetSchema>) => {
    if (!props.resetCode) return;

    try {
      await resetPassword.mutateAsync({
        ...values,
        code: props.resetCode,
      });

      props.onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} class='flex flex-col gap-2'>
        <Field name='password'>
          {(field, props) => (
            <>
              <Label>{t('USERS.FORM.PASSWORD')}</Label>
              <Input {...props} type='password' value={field.value} />
            </>
          )}
        </Field>

        <Field name='passwordConfirmation'>
          {(field, props) => (
            <>
              <Label>{t('USERS.FORM.CONFIRM_PASSWORD')}</Label>
              <Input {...props} type='password' value={field.value} />
            </>
          )}
        </Field>

        <Button type='submit'>
          {t('AUTHENTICATION.RESET_PASSWORD.TITLE')}
        </Button>
      </Form>
    </>
  );
};

export default ForgotPassword;
