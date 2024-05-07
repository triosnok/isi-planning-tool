import type { Component, ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupLabelProps,
  DropdownMenuItemProps,
  DropdownMenu as DropdownMenuPrimitive,
  DropdownMenuRadioItemProps,
  DropdownMenuRootProps,
  DropdownMenuSeparatorProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubTriggerProps,
} from '@kobalte/core/dropdown-menu';
import { TbCheck, TbChevronRight, TbCircle } from 'solid-icons/tb';

import { cn } from '@/lib/utils';
import { PolymorphicProps } from '@kobalte/core/polymorphic';

const DropdownMenu: Component<DropdownMenuRootProps> = (props) => {
  return <DropdownMenuPrimitive gutter={4} {...props} />;
};

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuContent: Component<
  PolymorphicProps<'div', DropdownMenuContentProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        class={cn(
          'animate-content-hide data-[expanded]:animate-content-show z-[2000] min-w-[8rem] origin-[var(--kb-menu-content-transform-origin)] overflow-hidden rounded-md border p-1 shadow-md',
          'bg-gray-50 text-gray-950',
          'dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50',
          props.class
        )}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  );
};

const DropdownMenuItem: Component<
  PolymorphicProps<'div', DropdownMenuItemProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <DropdownMenuPrimitive.Item
      class={cn(
        'focus:bg-brand-red-700 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class
      )}
      {...rest}
    />
  );
};

const DropdownMenuShortcut: Component<ComponentProps<'span'>> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <span
      class={cn('ml-auto text-xs tracking-widest opacity-60', props.class)}
      {...rest}
    />
  );
};

const DropdownMenuLabel: Component<
  ComponentProps<'div'> & { inset?: boolean }
> = (props) => {
  const [, rest] = splitProps(props, ['class', 'inset']);
  return (
    <div
      class={cn(
        'px-2 py-1.5 text-sm font-semibold',
        props.inset && 'pl-8',
        props.class
      )}
      {...rest}
    />
  );
};

const DropdownMenuSeparator: Component<
  PolymorphicProps<'div', DropdownMenuSeparatorProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <DropdownMenuPrimitive.Separator
      class={cn(
        '-mx-1 my-1 h-px bg-gray-100 dark:border-gray-800 dark:bg-gray-900',
        props.class
      )}
      {...rest}
    />
  );
};

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuSubTrigger: Component<
  PolymorphicProps<'div', DropdownMenuSubTriggerProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <DropdownMenuPrimitive.SubTrigger
      class={cn(
        'focus:bg-brand-red-700 data-[state=open]:bg-brand-red-700 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        props.class
      )}
      {...rest}
    >
      {props.children}
      <TbChevronRight class='ml-auto h-4 w-4' />
    </DropdownMenuPrimitive.SubTrigger>
  );
};

const DropdownMenuSubContent: Component<
  PolymorphicProps<'div', DropdownMenuSubContentProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <DropdownMenuPrimitive.SubContent
      class={cn(
        'animate-in z-50 min-w-[8rem] origin-[var(--kb-menu-content-transform-origin)] overflow-hidden rounded-md border bg-gray-50 p-1 text-gray-950 shadow-md',
        props.class
      )}
      {...rest}
    />
  );
};

const DropdownMenuCheckboxItem: Component<
  PolymorphicProps<'div', DropdownMenuCheckboxItemProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <DropdownMenuPrimitive.CheckboxItem
      class={cn(
        'focus:bg-brand-red-700 relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class
      )}
      {...rest}
    >
      <span class='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
        <DropdownMenuPrimitive.ItemIndicator>
          <TbCheck class='h-4 w-4' />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {props.children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
};

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuGroupLabel: Component<
  PolymorphicProps<'div', DropdownMenuGroupLabelProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <DropdownMenuPrimitive.GroupLabel
      class={cn('px-2 py-1.5 text-sm font-semibold', props.class)}
      {...rest}
    />
  );
};

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuRadioItem: Component<
  PolymorphicProps<'div', DropdownMenuRadioItemProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <DropdownMenuPrimitive.RadioItem
      class={cn(
        'focus:bg-brand-red-700 relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:text-gray-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class
      )}
      {...rest}
    >
      <span class='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
        <DropdownMenuPrimitive.ItemIndicator>
          <TbCircle class='h-2 w-2 fill-current' />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {props.children}
    </DropdownMenuPrimitive.RadioItem>
  );
};

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
