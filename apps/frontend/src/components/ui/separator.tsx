import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import { Separator as SeparatorPrimitive } from '@kobalte/core';

import { cn } from '@/lib/utils';
import clsx from 'clsx';

const Separator: Component<SeparatorPrimitive.SeparatorRootProps> = (props) => {
  const [, rest] = splitProps(props, ['class', 'orientation']);
  return (
    <SeparatorPrimitive.Root
      orientation={props.orientation ?? 'horizontal'}
      class={cn(
        'bg-border shrink-0',
        props.orientation === 'vertical' ? 'h-full w-[1px]' : 'h-[1px] w-full',
        props.class
      )}
      {...rest}
    />
  );
};

interface SeparatorWithTextProps extends SeparatorPrimitive.SeparatorRootProps {
  position: 'LEFT' | 'MIDDLE' | 'RIGHT';
  text: string;
}

const SeparatorWithText: Component<SeparatorWithTextProps> = (props) => {
  return (
    <div
      class={clsx('flex items-center', {
        'justify-start': props.position === 'LEFT',
        'justify-center': props.position === 'MIDDLE',
        'justify-end': props.position === 'RIGHT',
      })}
    >
      <div
        class={clsx('w-full border-b border-gray-200 dark:border-gray-600', {
          'w-12': props.position === 'LEFT',
          'w-full': props.position === 'RIGHT',
        })}
      />
      <span class='px-1 text-sm text-gray-500 '>{props.text}</span>
      <div
        class={clsx('w-full border-b border-gray-200 dark:border-gray-600', {
          'w-12': props.position === 'RIGHT',
          'w-full': props.position === 'LEFT',
        })}
      />
    </div>
  );
};

export { Separator, SeparatorWithText };
