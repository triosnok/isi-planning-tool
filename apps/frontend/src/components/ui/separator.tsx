import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import { Separator as SeparatorPrimitive } from '@kobalte/core';

import { cn } from '@/lib/utils';

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

interface SeparatorWithTextProps {
  position: 'LEFT' | 'MIDDLE' | 'RIGHT';
  text: string;
}

const SeparatorWithText: Component<SeparatorWithTextProps> = (props) => {
  return (
    <div
      class={cn(
        'flex items-center',
        props.position === 'LEFT' && 'justify-start',
        props.position === 'MIDDLE' && 'justify-center',
        props.position === 'RIGHT' && 'justify-end'
      )}
    >
      <div
        class={cn(
          'w-full border-b border-gray-200 dark:border-gray-600',
          props.position === 'LEFT' && 'w-12',
          props.position === 'RIGHT' && 'w-full'
        )}
      />
      <span class='px-1 text-sm text-gray-500 '>{props.text}</span>
      <div
        class={cn(
          'w-full border-b border-gray-200 dark:border-gray-600',
          props.position === 'RIGHT' && 'w-12',
          props.position === 'LEFT' && 'w-full'
        )}
      />
    </div>
  );
};

export { Separator, SeparatorWithText };
