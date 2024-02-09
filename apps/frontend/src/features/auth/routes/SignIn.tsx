import Logo from '@/components/logo/Logo';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Component } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { createForm, SubmitHandler, zodForm } from '@modular-forms/solid';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { useSignInMutation } from '../api';

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type SignInForm = z.infer<typeof SignInSchema>;

const SignIn: Component = () => {
  const [, { Form, Field }] = createForm({ validate: zodForm(SignInSchema) });
  const navigate = useNavigate();
  const { mutateAsync } = useSignInMutation();
  const handleSubmit: SubmitHandler<SignInForm> = async (values) => {
    try {
      await mutateAsync(values);
      navigate('/');
    } catch (error) {
      // ignored
    }
  };

  return (
    <div>
      <main>
        <div class='flex h-screen items-center justify-center'>
          <div class='flex w-full max-w-md flex-col items-center justify-center rounded-lg border border-gray-100 py-6 shadow-lg'>
            <Logo />

            <Form
              id='sign-in-form'
              class='flex w-full flex-col gap-2 px-4'
              onSubmit={handleSubmit}
            >
              <h1 class='font-title mt-2 text-center text-xl font-semibold'>
                Sign in to inSight
              </h1>

              <Label for='email' class='font-semibold'>
                E-mail
              </Label>
              <Field name='email'>
                {(field, props) => (
                  <Input
                    {...props}
                    type='email'
                    id='email'
                    placeholder='E-mail'
                    value={field.value}
                  />
                )}
              </Field>

              <Label for='password' class='font-semibold'>
                Password
              </Label>
              <Field name='password'>
                {(field, props) => (
                  <Input
                    {...props}
                    type='password'
                    id='password'
                    placeholder='Password'
                    value={field.value}
                  />
                )}
              </Field>

              <div class='flex justify-end'>
                <A class='text-sm hover:underline' href=''>
                  Forgot password?
                </A>
              </div>

              <Button class='mt-4'>Sign in</Button>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
