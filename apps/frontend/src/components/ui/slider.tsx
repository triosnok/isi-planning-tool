import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import { PolymorphicProps } from '@kobalte/core/polymorphic';
import { SliderFillProps, SliderLabelProps, Slider as SliderPrimitive, SliderRootProps, SliderThumbProps, SliderTrackProps, SliderValueLabelProps } from '@kobalte/core/slider';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const Slider: Component<
  PolymorphicProps<'div', SliderRootProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <SliderPrimitive
      class={cn(
        'relative flex w-full touch-none select-none flex-col items-center',
        props.class
      )}
      {...rest}
    />
  );
};

const SliderTrack: Component<
  PolymorphicProps<'div', SliderTrackProps>
> = (props) => {
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

const SliderFill: Component<
  PolymorphicProps<'div', SliderFillProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <SliderPrimitive.Fill
      class={cn('bg-brand-blue absolute h-full rounded-l-md', props.class)}
      {...rest}
    />
  );
};

const SliderThumb: Component<
  PolymorphicProps<'div', SliderThumbProps>
> = (props) => {
  const [, rest] = splitProps(props, ['class', 'children']);
  return (
    <SliderPrimitive.Thumb
      class={cn(
        'top-[-6px] block size-5 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'border-brand-blue-700 bg-brand-blue ring-offset-gray-50 focus-visible:ring-gray-200 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-400',
        props.class
      )}
      {...rest}
    >
      <SliderPrimitive.Input />
    </SliderPrimitive.Thumb>
  );
};

const SliderLabel: Component<SliderLabelProps> = (props) => {
  return <SliderPrimitive.Label as={Label} {...props} />;
};

const SliderValueLabel: Component<SliderValueLabelProps> = (
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
