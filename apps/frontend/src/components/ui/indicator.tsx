import type { Component, ComponentProps, JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const indicatorVariants = cva('rounded-lg border-2 p-2 truncate', {
  variants: {
    variant: {
      undetermined: 'border-gray-200 bg-gray-50 text-gray-950',
      success: 'border-success-600 bg-success-50 text-success-950',
      warning: 'border-warning-400 bg-warning-50 text-warning-950',
      error: 'border-error-600 bg-error-50 text-error-950',
    },
  },
  defaultVariants: {
    variant: 'undetermined',
  },
});

export interface IndicatorProps
  extends ComponentProps<'div'>,
    VariantProps<typeof indicatorVariants> {
  icon: JSX.Element;
  indicates: string;
  status: string;
}

const Indicator: Component<IndicatorProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'variant',
    'class',
    'icon',
    'indicates',
    'status',
  ]);

  return (
    <div
      class={cn(
        indicatorVariants({ variant: local.variant }),
        local.class,
        'flex flex-col items-center justify-center'
      )}
      {...rest}
    >
      {local.icon}
      {local.indicates}
      <span>{local.status}</span>
    </div>
  );
};

export { Indicator, indicatorVariants };
