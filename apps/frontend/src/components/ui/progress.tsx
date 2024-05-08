import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import {
  ProgressLabelProps,
  Progress as ProgressPrimitive,
  ProgressRootProps,
  ProgressValueLabelProps,
} from '@kobalte/core/progress';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { PolymorphicProps } from '@kobalte/core/polymorphic';

const Progress: Component<PolymorphicProps<'div', ProgressRootProps>> = (
  props
) => {
  const [, rest] = splitProps(props, ['children', 'class']);
  return (
    <ProgressPrimitive {...rest}>
      {props.children}
      <ProgressPrimitive.Track
        class={cn(
          'relative h-4 w-full overflow-hidden bg-gray-200 dark:bg-gray-800',
          props.class
        )}
      >
        <ProgressPrimitive.Fill class='bg-brand-blue-800 h-full w-[var(--kb-progress-fill-width)] flex-1 transition-all' />
      </ProgressPrimitive.Track>
    </ProgressPrimitive>
  );
};

const ProgressLabel: Component<ProgressLabelProps> = (props) => {
  return <ProgressPrimitive.Label as={Label} {...props} />;
};

const ProgressValueLabel: Component<ProgressValueLabelProps> = (props) => {
  return <ProgressPrimitive.ValueLabel as={Label} {...props} />;
};

export { Progress, ProgressLabel, ProgressValueLabel };
