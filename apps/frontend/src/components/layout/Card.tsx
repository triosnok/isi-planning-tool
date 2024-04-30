import { cn } from '@/lib/utils';
import { Component, ComponentProps, splitProps } from 'solid-js';

const Card: Component<ComponentProps<'div'>> = (props) => {
  const [_, rest] = splitProps(props, ['class']);

  return (
    <div
      class={cn(
        'rounded-lg border border-gray-200 dark:bg-gray-900 shadow-sm dark:border-gray-800 bg-gray-50',
        props.class
      )}
      {...rest}
    />
  );
};

export default Card;
