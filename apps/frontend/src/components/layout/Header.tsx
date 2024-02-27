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
      <nav class='text-primary-foreground flex flex-1 items-center justify-between'>
        <div class='flex flex-row items-center gap-4'>
          <A href='/' class='flex items-center gap-4 focus:outline-none'>
            <Logo variant='white' class='h-8' />

            <span class='select-none border-r-2 border-gray-200 pr-4 font-bold'>
              inSight
            </span>
          </A>

          <ul class='flex flex-row gap-4'>
            <li>
              <A href='/' class='hover:underline'>
                Home
              </A>
            </li>
            <li>
              <A href='/projects' class='hover:underline'>
                Projects
              </A>
            </li>
            <li>
              <A href='/' class='hover:underline'>
                Users
              </A>
            </li>
            <li>
              <A href='/vehicles' class='hover:underline'>
                Vehicles
              </A>
            </li>
          </ul>
        </div>
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
