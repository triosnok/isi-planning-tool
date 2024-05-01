import { cn } from '@/lib/utils';
import { Component } from 'solid-js';

export interface ErrorLabelProps {
  text?: string;
  class?: string;
}

const ErrorLabel: Component<ErrorLabelProps> = (props) => {
  return (
    <strong
      class={cn(
        'dark:text-error-400 text-error-600 text-sm',
        !props.text && 'hidden',
        props.class
      )}
    >
      {props.text}
    </strong>
  );
};

export default ErrorLabel;
