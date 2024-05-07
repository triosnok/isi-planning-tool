import type { Component, ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import {
  DialogContentProps,
  DialogDescriptionProps,
  DialogOverlayProps,
  DialogPortalProps,
  Dialog as DialogPrimitive,
  DialogTitleProps,
  DialogTriggerProps,
} from '@kobalte/core/dialog';

import { cn } from '@/lib/utils';
import { PolymorphicProps } from '@kobalte/core/polymorphic';
import { IconX } from '@tabler/icons-solidjs';

const Dialog = DialogPrimitive;

const DialogTrigger: Component<PolymorphicProps<'div', DialogTriggerProps>> = (
  props
) => {
  const [, rest] = splitProps(props, ['children']);
  return (
    <DialogPrimitive.Trigger {...rest}>
      {props.children}
    </DialogPrimitive.Trigger>
  );
};

const DialogPortal: Component<DialogPortalProps> = (props) => {
  const [, rest] = splitProps(props, ['children']);
  return (
    <DialogPrimitive.Portal {...rest}>
      <div class='fixed inset-0 z-50 flex items-start justify-center sm:items-center'>
        {props.children}
      </div>
    </DialogPrimitive.Portal>
  );
};

const DialogOverlay: Component<PolymorphicProps<'div', DialogOverlayProps>> = (
  props
) => {
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

const DialogContent: Component<PolymorphicProps<'div', DialogContentProps>> = (
  props
) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        class={cn(
          'data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 data-[closed]:slide-out-to-left-1/2 data-[closed]:slide-out-to-top-[48%] data-[expanded]:slide-in-from-left-1/2 data-[expanded]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-gray-50 p-6 shadow-lg duration-200 sm:rounded-lg dark:border-gray-800 dark:bg-gray-950',
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
    </DialogPortal>
  );
};

const DialogHeader: Component<ComponentProps<'div'>> = (props) => {
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

const DialogFooter: Component<ComponentProps<'div'>> = (props) => {
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

const DialogTitle: Component<PolymorphicProps<'div', DialogTitleProps>> = (
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

const DialogDescription: Component<
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
