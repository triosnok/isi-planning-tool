import { useSignOutMutation } from '@/features/auth/api';
import { Theme, useTheme } from '@/features/theme';
import { cn } from '@/lib/utils';
import { A } from '@solidjs/router';
import {
  IconLogout,
  IconMenu2,
  IconMoon,
  IconSearch,
  IconSettings,
} from '@tabler/icons-solidjs';
import { Component } from 'solid-js';
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
import { Switch } from '../ui/switch';
import { useTranslations } from '@/features/i18n';

const Header: Component = () => {
  const theme = useTheme();
  const signOut = useSignOutMutation();
  const { t } = useTranslations();

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
    } catch (error) {
      // todo
    }
  };

  return (
    <header class='bg-brand-blue flex items-center justify-between gap-4 px-4 py-2'>
      <nav class='flex flex-1 items-center justify-between text-gray-50'>
        <div class='flex flex-row items-center gap-4'>
          <A href='/' class='flex items-center gap-4 focus:outline-none'>
            <Logo variant='white' class='h-8' />

            <span class='hidden select-none border-r-2 border-gray-200 pr-4 font-bold md:block'>
              inSight
            </span>
          </A>

          <ul class='hidden flex-row gap-4 md:flex'>
            <li>
              <A href='/projects' class='hover:underline'>
                {t('PROJECTS.TITLE')}
              </A>
            </li>
            <li>
              <A href='/dashboard' class='hover:underline'>
                {t('DASHBOARD.TITLE')}
              </A>
            </li>
            <li>
              <A href='/users' class='hover:underline'>
                {t('USERS.TITLE')}
              </A>
            </li>
            <li>
              <A href='/vehicles' class='hover:underline'>
                {t('VEHICLES.TITLE')}
              </A>
            </li>
          </ul>
        </div>
      </nav>

      <label
        class={cn(
          'hidden flex-1 items-center justify-center rounded-md border pl-2 focus-within:ring-2 md:flex',
          'border-gray-300 bg-gray-50 ring-gray-300',
          'dark:border-gray-800 dark:bg-gray-900 dark:ring-gray-400'
        )}
      >
        <IconSearch class='h-5 w-5 text-gray-400 dark:text-gray-500' />

        <input
          class='h-8 flex-1 bg-transparent px-2 focus:outline-none'
          placeholder={t('NAVIGATION.SEARCH')}
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
                <A href='/projects'>{t('PROJECTS.TITLE')}</A>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <A href='/dashboard'>{t('DASHBOARD.TITLE')}</A>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <A href='/'>{t('USERS.TITLE')}</A>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <A href='/vehicles'>{t('VEHICLES.TITLE')}</A>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem class='flex items-center gap-1'>
                <IconSettings class='h-5 w-5' />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => theme.toggleTheme()}
                closeOnSelect={false}
                class='flex items-center gap-1'
              >
                <IconMoon class='h-5 w-5' />
                <span>Dark theme</span>
                <Switch checked={theme.theme() === Theme.DARK} class='ml-1' />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                class='flex items-center gap-1'
              >
                <IconLogout class='h-5 w-5' />
                <span>{t('AUTHENTICATION.SIGN_OUT')}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </header>
  );
};

export default Header;
