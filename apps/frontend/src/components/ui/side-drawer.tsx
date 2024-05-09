import type { Component, ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import { DialogContentProps, DialogDescriptionProps, DialogOverlayProps, DialogPortalProps, Dialog as DialogPrimitive, DialogTitleProps, DialogTriggerProps } from '@kobalte/core/dialog';

import { cn } from '@/lib/utils';
import { PolymorphicProps } from '@kobalte/core/polymorphic';
import { IconX } from '@tabler/icons-solidjs';

const SideDrawer = DialogPrimitive;

const SideDrawerTrigger: Component<
  PolymorphicProps<'div', DialogTriggerProps>
> = (props) => {
  const [, rest] = splitProps(props, ['children']);
  return (
    <DialogPrimitive.Trigger {...rest}>
      {props.children}
    </DialogPrimitive.Trigger>
  );
};

const SideDrawerPortal: Component<
  PolymorphicProps<'div', DialogPortalProps>
> = (props) => {
  const [, rest] = splitProps(props, ['children']);
  return (
    <DialogPrimitive.Portal {...rest}>
      <div class='fixed inset-0 z-[9999999] flex items-start justify-center sm:items-center'>
        {props.children}
      </div>
    </DialogPrimitive.Portal>
  );
};

const SideDrawerOverlay: Component<
  PolymorphicProps<'div', DialogOverlayProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <DialogPrimitive.Overlay
      class={cn(
        'data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 fixed inset-0 z-50 bg-gray-50/80 backdrop-blur-sm dark:bg-gray-950/80',
        props.class
      )}
      {...rest}
    />
  );
};

const SideDrawerContent: Component<
  PolymorphicProps<'div', DialogContentProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <SideDrawerPortal>
      <SideDrawerOverlay />
      <DialogPrimitive.Content
        class={cn(
          'data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:slide-out-to-right-full data-[expanded]:slide-in-from-right-full fixed right-0 z-50 grid h-svh w-full max-w-lg gap-4 border-l bg-gray-50 p-6 shadow-lg outline-none duration-200 dark:border-gray-800 dark:bg-gray-950',
          props.class
        )}
        {...rest}
      >
        {props.children}
        <DialogPrimitive.CloseButton class='data-[expanded]:bg-brand-red-700 absolute right-4 top-4 rounded-sm opacity-70 ring-offset-gray-50 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:pointer-events-none data-[expanded]:text-gray-500'>
          <IconX class='size-4' />
          <span class='sr-only'>Close</span>
        </DialogPrimitive.CloseButton>
      </DialogPrimitive.Content>
    </SideDrawerPortal>
  );
};

const SideDrawerHeader: Component<ComponentProps<'div'>> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <div
      class={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        props.class
      )}
      {...rest}
    />
  );
};

const SideDrawerFooter: Component<ComponentProps<'div'>> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <div
      class={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        props.class
      )}
      {...rest}
    />
  );
};

const SideDrawerTitle: Component<
  PolymorphicProps<'div', DialogTitleProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <DialogPrimitive.Title
      class={cn(
        'text-lg font-semibold leading-none tracking-tight',
        props.class
      )}
      {...rest}
    />
  );
};

const SideDrawerDescription: Component<
  PolymorphicProps<'div', DialogDescriptionProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <DialogPrimitive.Description
      class={cn('text-sm text-gray-500', props.class)}
      {...rest}
    />
  );
};

export {
  SideDrawer, SideDrawerContent, SideDrawerDescription, SideDrawerFooter, SideDrawerHeader, SideDrawerTitle, SideDrawerTrigger
};

