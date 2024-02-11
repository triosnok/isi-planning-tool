import { Component } from 'solid-js';
import Logo from '../logo/Logo';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { useSignOutMutation } from '@/features/auth/api';
import { useNavigate } from '@solidjs/router';

const Header: Component = () => {
  const signOut = useSignOutMutation();
  const navigate = useNavigate();

  return (
    <header>
      <nav class='flex items-center justify-between gap-8 bg-gray-100 px-4'>
        <Logo class='h-16 w-16' />
        <Input class='max-w-screen-sm'></Input>
        <DropdownMenu>
          <DropdownMenuTrigger as={Button}>Profile</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span
                onClick={async () => {
                  try {
                    await signOut.mutateAsync();
                    navigate('/sign-in');
                  } catch (error) {
                    // todo
                  }
                }}
              >
                Sign out
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Header;
