import type { Component, ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import { cn } from '@/lib/utils';

const Input: Component<ComponentProps<'input'>> = (props) => {
  const [, rest] = splitProps(props, ['type', 'class']);
  return (
    <input
      type={props.type}
      class={cn(
        'border-gray-200 ring-offset-gray-50 placeholder:text-gray-500 focus-visible:ring-gray-900 flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )}
      {...rest}
    />
  );
};

export { Input };
