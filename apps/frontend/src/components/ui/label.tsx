import type { Component, ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import { cn } from '@/lib/utils';

export interface LabeLProps extends ComponentProps<'label'> {
  required?: boolean;
}

const Label: Component<LabeLProps> = (props) => {
  const [, rest] = splitProps(props, ['class', 'required']);
  return (
    <label
      class={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        props.required && "after:ml-0.5 after:text-error-500 after:content-['*']",
        props.class
      )}
      {...rest}
    />
  );
};

export { Label };
