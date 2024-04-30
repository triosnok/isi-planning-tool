import type { Component } from 'solid-js';
import { Show, splitProps } from 'solid-js';

import { Switch as SwitchPrimitive } from '@kobalte/core';

import { cn } from '@/lib/utils';

interface SwitchButtonProps extends SwitchPrimitive.SwitchRootProps {
  label?: string;
  errorMessage?: string;
}

const SwitchButton: Component<SwitchButtonProps> = (props) => {
  const [, rest] = splitProps(props, ['label']);
  return (
    <SwitchPrimitive.Root {...rest}>
      <SwitchPrimitive.Input />
      <div class='items-top flex space-x-2'>
        <SwitchPrimitive.Control class='data-[checked]:bg-brand-blue-800 dark:data-[checked]:bg-brand-blue-800 peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-gray-300 dark:border-gray-700 bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800'>
          <SwitchPrimitive.Thumb
            class={cn(
              'pointer-events-none block size-5 translate-x-0 rounded-full bg-gray-50 shadow-lg ring-0 transition-transform data-[checked]:translate-x-5'
            )}
          />
        </SwitchPrimitive.Control>
        <div class='grid gap-1.5 leading-none'>
          <Show when={props.label}>
            <SwitchPrimitive.Label class='text-sm font-medium leading-none group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-70'>
              {props.label}
            </SwitchPrimitive.Label>
          </Show>
          <Show when={props.errorMessage}>
            <SwitchPrimitive.ErrorMessage class='text-error-800-800 text-sm'>
              {props.errorMessage}
            </SwitchPrimitive.ErrorMessage>
          </Show>
        </div>
      </div>
    </SwitchPrimitive.Root>
  );
};

export { SwitchButton };

