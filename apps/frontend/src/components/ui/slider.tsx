import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import { Slider as SliderPrimitive } from '@kobalte/core';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const Slider: Component<SliderPrimitive.SliderRootProps> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <SliderPrimitive.Root
      class={cn(
        'relative flex w-full touch-none select-none flex-col items-center',
        props.class
      )}
      {...rest}
    />
  );
};

const SliderTrack: Component<SliderPrimitive.SliderTrackProps> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <SliderPrimitive.Track
      class={cn(
        'relative h-2 w-full grow rounded-full bg-gray-200 dark:bg-gray-800',
        props.class
      )}
      {...rest}
    />
  );
};

const SliderFill: Component<SliderPrimitive.SliderFillProps> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <SliderPrimitive.Fill
      class={cn('bg-brand-blue absolute h-full rounded-l-md', props.class)}
      {...rest}
    />
  );
};

const SliderThumb: Component<SliderPrimitive.SliderThumbProps> = (props) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <SliderPrimitive.Thumb
      class={cn(
        'top-[-6px] block size-5 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'border-brand-blue-700 bg-brand-blue dark:focus-visible:ring-gray-400 ring-offset-gray-50 focus-visible:ring-gray-200 dark:ring-offset-gray-950',
        props.class
      )}
      {...rest}
    >
      <SliderPrimitive.Input />
    </SliderPrimitive.Thumb>
  );
};

const SliderLabel: Component<SliderPrimitive.SliderLabelProps> = (props) => {
  return <SliderPrimitive.Label as={Label} {...props} />;
};

const SliderValueLabel: Component<SliderPrimitive.SliderValueLabelProps> = (
  props
) => {
  return <SliderPrimitive.ValueLabel as={Label} {...props} />;
};

export {
  Slider,
  SliderFill,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
};
