import type { Component, ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const calloutVariants = cva('rounded-md border-l-4 p-2 pl-4', {
  variants: {
    variant: {
      default:
        'border-gray-600 bg-gray-200 text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
      success:
        'border-success-600 bg-success-200 text-success-600 dark:border-success-500 dark:bg-success-900 dark:text-success-300',
      warning:
        'border-warning-600 bg-warning-200 text-warning-600 dark:border-warning-500 dark:bg-warning-800 dark:text-warning-300',
      error:
        'border-error-600 bg-error-200 text-error-600 dark:border-error-600 dark:bg-error-900 dark:text-error-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CalloutProps
  extends ComponentProps<'div'>,
    VariantProps<typeof calloutVariants> {}

const Callout: Component<CalloutProps> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <div
      class={cn(calloutVariants({ variant: props.variant }), props.class)}
      {...rest}
    />
  );
};

const CalloutTitle: Component<ComponentProps<'h3'>> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return <h3 class={cn('font-semibold', props.class)} {...rest} />;
};

const CalloutContent: Component<ComponentProps<'div'>> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return <div class={cn('mt-2', props.class)} {...rest} />;
};

export { Callout, CalloutContent, CalloutTitle };

