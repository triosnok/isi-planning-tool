import type { Component, ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import { Dialog as DialogPrimitive } from '@kobalte/core';
import { TbX } from 'solid-icons/tb';

import { cn } from '@/lib/utils';

const SideDrawer = DialogPrimitive.Root;

const SideDrawerTrigger: Component<DialogPrimitive.DialogTriggerProps> = (
  props
) => {
  const [, rest] = splitProps(props, ['children']);
  return (
    <DialogPrimitive.Trigger {...rest}>
      {props.children}
    </DialogPrimitive.Trigger>
  );
};

const SideDrawerPortal: Component<DialogPrimitive.DialogPortalProps> = (
  props
) => {
  const [, rest] = splitProps(props, ['children']);
  return (
    <DialogPrimitive.Portal {...rest}>
      <div class='fixed inset-0 z-[9999999] flex items-start justify-center sm:items-center'>
        {props.children}
      </div>
    </DialogPrimitive.Portal>
  );
};

const SideDrawerOverlay: Component<DialogPrimitive.DialogOverlayProps> = (
  props
) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <DialogPrimitive.Overlay
      class={cn(
        'bg-background/80 data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm',
        props.class
      )}
      {...rest}
    />
  );
};

const SideDrawerContent: Component<DialogPrimitive.DialogContentProps> = (
  props
) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <SideDrawerPortal>
      <SideDrawerOverlay />
      <DialogPrimitive.Content
        class={cn(
          'bg-background data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:slide-out-to-right-full data-[expanded]:slide-in-from-right-full fixed right-0 z-50 grid h-svh w-full max-w-lg gap-4 border p-6 shadow-lg duration-200',
          props.class
        )}
        {...rest}
      >
        {props.children}
        <DialogPrimitive.CloseButton class='ring-offset-background focus:ring-ring data-[expanded]:bg-accent data-[expanded]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none'>
          <TbX class='size-4' />
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

const SideDrawerTitle: Component<DialogPrimitive.DialogTitleProps> = (
  props
) => {
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
  DialogPrimitive.DialogDescriptionProps
> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <DialogPrimitive.Description
      class={cn('text-muted-foreground text-sm', props.class)}
      {...rest}
    />
  );
};

export {
  SideDrawer,
  SideDrawerTrigger,
  SideDrawerContent,
  SideDrawerHeader,
  SideDrawerFooter,
  SideDrawerTitle,
  SideDrawerDescription,
};
