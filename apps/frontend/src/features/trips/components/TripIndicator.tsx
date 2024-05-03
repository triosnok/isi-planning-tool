import type { Component, ComponentProps, JSX } from 'solid-js';
import { splitProps } from 'solid-js';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { IconType, cn } from '@/lib/utils';

export enum TripIndicatorVariant {
  UNDETERMINED = 'undetermined',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

const tripIndicatorVariants = cva('rounded-lg border-2 p-2 truncate', {
  variants: {
    variant: {
      [TripIndicatorVariant.UNDETERMINED]:
        'border-gray-200 bg-gray-50 text-gray-950 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-50',
      [TripIndicatorVariant.SUCCESS]:
        'border-success-600 bg-success-50 text-success-950 dark:bg-success-950 dark:text-success-50',
      [TripIndicatorVariant.WARNING]:
        'border-warning-400 bg-warning-50 text-warning-950 dark:bg-warning-950 dark:text-warning-50',
      [TripIndicatorVariant.ERROR]:
        'border-error-600 bg-error-50 text-error-950 dark:bg-error-950 dark:text-error-50',
    },
  },
  defaultVariants: {
    variant: TripIndicatorVariant.UNDETERMINED,
  },
});

export interface TripIndicatorProps
  extends ComponentProps<'div'>,
    VariantProps<typeof tripIndicatorVariants> {
  icon: IconType;
  indicates: string;
  status: string;
}

const TripIndicator: Component<TripIndicatorProps> = (props) => {
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
        tripIndicatorVariants({ variant: local.variant }),
        local.class,
        'flex flex-col items-center justify-center'
      )}
      {...rest}
    >
      <local.icon />
      {local.indicates}
      <span>{local.status}</span>
    </div>
  );
};

export { TripIndicator, tripIndicatorVariants };
