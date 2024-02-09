import Logo from '@/components/logo/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Component } from 'solid-js';
import { A } from '@solidjs/router';

const SignIn: Component = () => {
  return (
    <div>
      <main>
        <div class='flex h-screen items-center justify-center'>
          <div class='flex h-1/2 w-1/5 flex-col items-center justify-center rounded-lg border border-gray-100 shadow-lg'>
            <Logo />

            <form id='sign-in-form' class='flex w-full flex-col gap-2 px-4'>
              <h1 class='font-title mt-2 text-center text-xl font-semibold'>
                Sign in to inSight
              </h1>

              <Label for='email' class='font-semibold'>
                E-mail
              </Label>
              <Input type='email' id='email' placeholder='E-mail' />

              <Label for='password' class='font-semibold'>
                Password
              </Label>
              <Input type='password' id='password' placeholder='Password' />

              <div class='flex justify-end'>
                <A class='text-sm underline' href=''>
                  Forgot password?
                </A>
              </div>

              <Button color='' class='mt-4'>Sign in</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
