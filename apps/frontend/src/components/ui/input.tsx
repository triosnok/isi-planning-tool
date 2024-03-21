import type { Component, ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import { cn } from '@/lib/utils';

const Input: Component<ComponentProps<'input'>> = (props) => {
  const [, rest] = splitProps(props, ['type', 'class']);
  return (
    <input
      type={props.type}
      class={cn(
        'flex h-10 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm ring-offset-gray-50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-gray-400 dark:focus-visible:ring-gray-400',
        props.class
      )}
      {...rest}
    />
  );
};

export { Input };
