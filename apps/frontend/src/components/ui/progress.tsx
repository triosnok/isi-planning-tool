import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import { Progress as ProgressPrimitive } from '@kobalte/core';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const Progress: Component<ProgressPrimitive.ProgressRootProps> = (props) => {
  const [, rest] = splitProps(props, ['children', 'class']);
  return (
    <ProgressPrimitive.Root {...rest}>
      {props.children}
      <ProgressPrimitive.Track
        class={cn(
          'relative h-4 w-full overflow-hidden bg-gray-200 dark:bg-gray-800',
          props.class
        )}
      >
        <ProgressPrimitive.Fill class='bg-brand-blue-800 h-full w-[var(--kb-progress-fill-width)] flex-1 transition-all' />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
};

const ProgressLabel: Component<ProgressPrimitive.ProgressLabelProps> = (
  props
) => {
  return <ProgressPrimitive.Label as={Label} {...props} />;
};

const ProgressValueLabel: Component<
  ProgressPrimitive.ProgressValueLabelProps
> = (props) => {
  return <ProgressPrimitive.ValueLabel as={Label} {...props} />;
};

export { Progress, ProgressLabel, ProgressValueLabel };
