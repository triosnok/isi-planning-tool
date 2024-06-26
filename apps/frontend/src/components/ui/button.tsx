import type { Component, ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { IconLoader2 } from '@tabler/icons-solidjs';

const buttonVariants = cva(
  'ring-offset-gray-50 focus-visible:ring-gray-900 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand-blue-800 text-gray-50 hover:bg-brand-blue-800/90',
        destructive: 'bg-error-800 text-gray-50 hover:bg-error-800/90',
        outline:
          'border-gray-200 hover:bg-brand-red-700 hover:text-gray-50 border',
        secondary: 'bg-brand-blue-700 text-gray-50 hover:bg-brand-blue-700/80',
        ghost: 'hover:bg-brand-red-700 hover:text-gray-50',
        link: 'text-brand-blue-800 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button: Component<ButtonProps> = (props) => {
  const [, rest] = splitProps(props, [
    'variant',
    'size',
    'class',
    'loading',
    'children',
  ]);

  return (
    <button
      class={cn(
        buttonVariants({ variant: props.variant, size: props.size }),
        props.class
      )}
      disabled={props.loading}
      {...rest}
    >
      {props.loading && <IconLoader2 class='-ml-7 mr-2 size-5 animate-spin' />}
      <span>{props.children}</span>
    </button>
  );
};

export { Button, buttonVariants };
