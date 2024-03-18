import { useSignOutMutation } from '@/features/auth/api';
import { A } from '@solidjs/router';
import { IconMenu2, IconSearch } from '@tabler/icons-solidjs';
import { Component, Show, createSignal, onCleanup } from 'solid-js';
import Logo from '../logo/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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

            <span class='hidden select-none border-r-2 border-gray-200 pr-4 font-bold md:block'>
              inSight
            </span>
          </A>

          <ul class='hidden flex-row gap-4 md:flex'>
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

      <label class='hidden flex-1 items-center justify-center rounded-md border border-gray-300 bg-gray-50 pl-2 ring-gray-300 focus-within:ring-2 md:flex'>
        <IconSearch class='h-5 w-5 text-gray-400' />

        <input
          class='h-8 flex-1 bg-transparent px-2 focus:outline-none'
          placeholder='Search...'
        />
      </label>

      <section class='flex flex-1 flex-row-reverse'>
        <DropdownMenu>
          <DropdownMenuTrigger as={Avatar} class='h-8 w-8'>
            <IconMenu2 class='h-8 w-8 text-gray-50 md:hidden' />
            <AvatarImage
              class='hidden md:block'
              src='https://avatars.githubusercontent.com/u/47036430'
            />
            <AvatarFallback>thedatasnok</AvatarFallback>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup class='md:hidden'>
              <DropdownMenuItem>
                <A href='/'>Home</A>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <A href='/projects'>Projects</A>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <A href='/'>Users</A>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <A href='/vehicles'>Vehicles</A>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </header>
  );
};

export default Header;
