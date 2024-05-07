import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import {
  PopoverContentProps,
  Popover as PopoverPrimitive,
  PopoverRootProps,
} from '@kobalte/core/popover';

import { cn } from '@/lib/utils';
import { PolymorphicProps } from '@kobalte/core/polymorphic';

const Popover: Component<PopoverRootProps> = (props) => {
  return <PopoverPrimitive gutter={4} {...props} />;
};

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent: Component<
  PolymorphicProps<'div', PopoverContentProps>
> = (props) => {
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

export { Popover, PopoverCloseButton, PopoverContent, PopoverTrigger };
