import type { Component } from 'solid-js';
import { splitProps } from 'solid-js';

import {
  ImageFallbackProps,
  ImageImgProps,
  Image as ImagePrimitive,
  ImageRootProps,
} from '@kobalte/core/image';

import { cn } from '@/lib/utils';
import { PolymorphicProps } from '@kobalte/core/polymorphic';

const Avatar: Component<PolymorphicProps<'div', ImageRootProps>> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <ImagePrimitive
      class={cn(
        'relative flex size-10 shrink-0 overflow-hidden rounded-full',
        props.class
      )}
      {...rest}
    />
  );
};

const AvatarImage: Component<PolymorphicProps<'div', ImageImgProps>> = (
  props
) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <ImagePrimitive.Img
      class={cn('aspect-square size-full', props.class)}
      {...rest}
    />
  );
};

const AvatarFallback: Component<PolymorphicProps<'div', ImageFallbackProps>> = (
  props
) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <ImagePrimitive.Fallback
      class={cn(
        'flex size-full items-center justify-center rounded-full border border-gray-500 bg-gray-700 text-gray-50',
        props.class
      )}
      {...rest}
    />
  );
};

export { Avatar, AvatarFallback, AvatarImage };
