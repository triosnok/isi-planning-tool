import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import { Select as SelectPrimitive } from '@kobalte/core';
import { TbCheck, TbChevronDown } from 'solid-icons/tb';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger: Component<SelectPrimitive.SelectTriggerProps> = (
  props
) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <SelectPrimitive.Trigger
      class={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm ring-offset-gray-50 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-gray-400 dark:focus-visible:ring-gray-400 dark:ring-offset-gray-400',
        props.class
      )}
      {...rest}
    >
      {props.children}
      <SelectPrimitive.Icon>
        <TbChevronDown class='size-4 opacity-50' />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
};

const SelectContent: Component<SelectPrimitive.SelectContentProps> = (
  props
) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        class={cn(
          'animate-in fade-in-80 relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-gray-50 shadow-md dark:border-gray-800 dark:bg-gray-950',
          props.class
        )}
        {...rest}
      >
        <SelectPrimitive.Listbox class='m-0 p-1' />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

const SelectItem: Component<SelectPrimitive.SelectItemProps> = (props) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <SelectPrimitive.Item
      class={cn(
        'relative mt-0 flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-200 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'dark:focus:bg-gray-900',
        props.class
      )}
      {...rest}
    >
      <span class='absolute left-2 flex size-3.5 items-center justify-center'>
        <SelectPrimitive.ItemIndicator>
          <TbCheck class='size-4' />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemLabel class='flex-1'>
        {props.children}
      </SelectPrimitive.ItemLabel>
    </SelectPrimitive.Item>
  );
};

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };
