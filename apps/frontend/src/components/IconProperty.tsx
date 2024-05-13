import { IconType, cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Component, Show } from 'solid-js';

export interface IconPropertyProps {
  /**
   * The side of the property, right will move the icon to the right side and right align the text.
   */
  side?: 'left' | 'right';
  /**
   * The size of the property, defaults to sm.
   */
  size?: 'xs' | 'sm';
  icon: IconType;
  text?: string;
  fallbackText?: string;
  show?: boolean;
}

const IconProperty: Component<IconPropertyProps> = (props) => {
  const show = () => {
    const prop = props.show;

    return prop ?? true;
  };

  const text = () => {
    const text = props.text;
    const fallback = props.fallbackText;

    if (fallback && (text === undefined || text.length === 0)) {
      return fallback;
    }

    return text;
  };

  return (
    <Show when={show()}>
      <div
        class={cn(
          'flex flex-row items-center gap-1',
          props.side === 'right' && 'flex-row-reverse'
        )}
      >
        <props.icon
          class={cn(
            'size-5 text-gray-500 dark:text-gray-400 flex-shrink-0',
            props.size === 'xs' && 'size-4'
          )}
        />

        <span
          class={cn(
            'text-sm dark:text-gray-100 truncate',
            props.size === 'xs' && 'text-xs'
          )}
        >
          {text()}
        </span>
      </div>
    </Show>
  );
};

export default IconProperty;
