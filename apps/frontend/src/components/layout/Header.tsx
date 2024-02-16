import { useSignOutMutation } from '@/features/auth/api';
import { A } from '@solidjs/router';
import { Component } from 'solid-js';
import Logo from '../logo/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';

const Header: Component = () => {
  const signOut = useSignOutMutation();

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
    } catch (error) {
      // todo
    }
  };

  return (
    <header class='bg-brand-blue flex items-center justify-between gap-4 px-4 py-2'>
      <nav class='flex flex-1 items-center justify-between'>
        <A href='/'>
          <Logo variant='white' class='h-8' />
        </A>
      </nav>

      <section class='flex flex-1 items-center justify-center'>
        <Input class='h-8 max-w-screen-sm' />
      </section>

      <section class='flex flex-1 flex-row-reverse'>
        <DropdownMenu>
          <DropdownMenuTrigger as={Avatar} class='h-8 w-8'>
            <AvatarImage src='https://avatars.githubusercontent.com/u/47036430' />
            <AvatarFallback>thedatasnok</AvatarFallback>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </header>
  );
};

export default Header;
