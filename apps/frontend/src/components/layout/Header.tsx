import { useProfile, useSignOutMutation } from '@/features/auth/api';
import { DateFormat, useTranslations } from '@/features/i18n';
import { CommandSearch } from '@/features/search';
import { Theme, useTheme } from '@/features/theme';
import ActiveTripButton from '@/features/trips/components/ActiveTripButton';
import { useTripsByUserQuery } from '@/features/users/api';
import { IconType, cn } from '@/lib/utils';
import { A, useParams } from '@solidjs/router';
import {
  IconCapture,
  IconCar,
  IconClipboardList,
  IconDashboard,
  IconLogout,
  IconMenu2,
  IconMoon,
  IconSettings,
  IconUsers,
} from '@tabler/icons-solidjs';
import { Component, Show, createMemo } from 'solid-js';
import Logo from '../logo/Logo';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';
import {
  SideDrawer,
  SideDrawerContent,
  SideDrawerTrigger,
} from '../ui/side-drawer';
import { SwitchButton } from '../ui/switch-button';

const Header: Component = () => {
  const theme = useTheme();
  const signOut = useSignOutMutation();
  const { t, d } = useTranslations();
  const profile = useProfile();
  const activeTrips = useTripsByUserQuery(() => profile.data?.id, true);
  const params = useParams();

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
    } catch (error) {
      // todo
    }
  };

  const userInitials = createMemo(() => {
    const name = profile.data?.fullName;
    if (name === undefined) return '';

    const names = name
      .split(' ')
      .map((n) => n.trim().charAt(0))
      .slice(0, 2);

    return names.join('');
  });

  return (
    <header class='bg-brand-blue flex items-center justify-between gap-4 px-4 py-2'>
      <nav class='flex flex-1 items-center text-gray-50'>
        <div class='flex flex-row items-center gap-2'>
          <A href='/' class='flex items-center gap-4 focus:outline-none'>
            <Logo variant='white' class='h-8' />

            <span class='select-none border-r-2 border-gray-200 pr-4 font-bold max-md:hidden'>
              inSight
            </span>
          </A>

          <ul class='hidden flex-row gap-1 md:flex'>
            <HeaderLink
              href='/projects'
              icon={IconClipboardList}
              text={t('PROJECTS.TITLE')}
            />

            <HeaderLink
              href='/dashboard'
              icon={IconDashboard}
              text={t('DASHBOARD.TITLE')}
            />

            <HeaderLink
              href='/users'
              icon={IconUsers}
              text={t('USERS.TITLE')}
            />

            <HeaderLink
              href='/vehicles'
              icon={IconCar}
              text={t('VEHICLES.TITLE')}
            />

            <HeaderLink
              href='/capture'
              icon={IconCapture}
              text={t('CAPTURE.TITLE')}
            />
          </ul>
        </div>
      </nav>

      <section class='flex flex-1 flex-row-reverse gap-8'>
        <CommandSearch.Root>
          <CommandSearch.Trigger />
          <CommandSearch.Dialog />
        </CommandSearch.Root>

        <SideDrawer>
          <SideDrawerTrigger class='text-gray-50 md:hidden'>
            <IconMenu2 />
          </SideDrawerTrigger>
          <SideDrawerContent class='flex max-w-xs flex-col gap-2'>
            <div class='flex items-center gap-2'>
              <Avatar>
                <AvatarFallback>{userInitials()}</AvatarFallback>
              </Avatar>

              <div class='flex flex-col'>
                <h2 class='text-lg font-semibold'>{profile.data?.fullName}</h2>

                <a
                  href={`mailto:${profile.data?.email}`}
                  class='-mt-1 text-sm text-gray-600 dark:text-gray-400'
                >
                  {profile.data?.email}
                </a>
              </div>
            </div>

            <Separator />

            <nav class='flex flex-col gap-2'>
              <ul>
                <HeaderLink
                  href='/projects'
                  icon={IconClipboardList}
                  text={t('PROJECTS.TITLE')}
                  mobile
                />

                <HeaderLink
                  href='/dashboard'
                  icon={IconDashboard}
                  text={t('DASHBOARD.TITLE')}
                  mobile
                />

                <HeaderLink
                  href='/users'
                  icon={IconUsers}
                  text={t('USERS.TITLE')}
                  mobile
                />

                <HeaderLink
                  href='/vehicles'
                  icon={IconCar}
                  text={t('VEHICLES.TITLE')}
                  mobile
                />

                <HeaderLink
                  href='/capture'
                  icon={IconCapture}
                  text={t('CAPTURE.TITLE')}
                  mobile
                />

                <HeaderLink
                  href='/settings'
                  icon={IconSettings}
                  text={t('GENERAL.SETTINGS')}
                  mobile
                />
              </ul>
            </nav>

            <Separator />

            <button
              type='button'
              role='switch'
              onClick={() => theme.toggleTheme()}
              class='flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-800'
            >
              <IconMoon class='size-4' />
              <span>{t('GENERAL.DARK_THEME')}</span>
              <SwitchButton
                checked={theme.theme() === Theme.DARK}
                class='ml-auto'
              />
            </button>

            <button
              type='button'
              onClick={handleSignOut}
              class={cn(
                'mt-auto flex w-full items-center gap-1 rounded-md border-2 border-transparent px-2 py-1.5 text-sm font-medium',
                'border-gray-300 dark:border-gray-700'
              )}
            >
              <IconLogout class='size-4' />
              <span>{t('AUTHENTICATION.SIGN_OUT')}</span>
            </button>
          </SideDrawerContent>
        </SideDrawer>

        <DropdownMenu>
          <DropdownMenuTrigger as={Avatar} class='h-8 w-8 max-md:hidden'>
            {/* <AvatarImage src='https://avatars.githubusercontent.com/u/47036430' /> */}
            <AvatarFallback>{userInitials()}</AvatarFallback>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem class='flex items-center gap-1'>
                <IconSettings class='h-5 w-5' />
                <span>{t('GENERAL.SETTINGS')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => theme.toggleTheme()}
                closeOnSelect={false}
                class='flex items-center gap-1'
              >
                <IconMoon class='h-5 w-5' />
                <span>{t('GENERAL.DARK_THEME')}</span>
                <SwitchButton
                  checked={theme.theme() === Theme.DARK}
                  class='ml-1'
                />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                class='flex items-center gap-1'
              >
                <IconLogout class='h-5 w-5' />
                <span>{t('AUTHENTICATION.SIGN_OUT')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div class='flex w-full flex-col items-center text-xs text-gray-500'>
                <p>v{__APP_BUILD_VERSION__}</p>
                <p>
                  {t('GENERAL.UPDATED')}{' '}
                  {d(__APP_BUILD_TIMESTAMP__, DateFormat.DATETIME)}
                </p>
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Show
          when={
            (activeTrips.data?.length ?? 0) > 0 &&
            params.tripId !== activeTrips.data?.[0].id
          }
        >
          <ActiveTripButton
            projectId={activeTrips.data?.[0].projectId!}
            tripId={activeTrips.data?.[0].id!}
          />
        </Show>
      </section>
    </header>
  );
};

interface HeaderLinkProps {
  icon: IconType;
  text?: string;
  href: string;
  mobile?: boolean;
}

/**
 * Opinionated component for rendering headers
 */
const HeaderLink: Component<HeaderLinkProps> = (props) => {
  return (
    <li>
      <A
        href={props.href}
        class={cn(
          'flex items-center gap-1 rounded-md border-2 border-transparent px-2 py-1.5 text-sm font-medium transition-colors',
          'hover:bg-brand-blue-900 focus:bg-brand-blue-900 focus:border-brand-blue-500 focus:outline-none',
          'aria-[current=page]:bg-brand-blue-900/75 aria-[current=page]:hover:bg-brand-blue-900',
          props.mobile &&
            'aria-[current=page]:bg-brand-blue hover:bg-gray-200 focus:border-transparent focus:bg-gray-200 aria-[current=page]:text-gray-50 dark:hover:bg-gray-800 dark:focus:bg-gray-800'
        )}
      >
        <props.icon class='size-4' />
        <span>{props.text}</span>
      </A>
    </li>
  );
};

export default Header;
