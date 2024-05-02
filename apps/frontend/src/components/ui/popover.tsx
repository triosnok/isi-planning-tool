import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import { Popover as PopoverPrimitive } from '@kobalte/core';

import { cn } from '@/lib/utils';

const Popover: Component<PopoverPrimitive.PopoverRootProps> = (props) => {
  return <PopoverPrimitive.Root gutter={4} {...props} />;
};

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent: Component<PopoverPrimitive.PopoverContentProps> = (
  props
) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        class={cn(
          'data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 z-50 origin-[var(--kb-gray-50-content-transform-origin)] rounded-md border bg-gray-50 p-4 text-gray-950 shadow-md outline-none',
          'dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50',
          props.class
        )}
        {...rest}
      />
    </PopoverPrimitive.Portal>
  );
};

const PopoverCloseButton = PopoverPrimitive.CloseButton;

export { Popover, PopoverTrigger, PopoverContent, PopoverCloseButton };
