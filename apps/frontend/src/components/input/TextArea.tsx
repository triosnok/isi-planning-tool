import { cn } from '@/lib/utils';
import { PolymorphicProps } from '@kobalte/core/polymorphic';
import { TextField, TextFieldTextAreaProps } from '@kobalte/core/text-field';
import { Component, splitProps } from 'solid-js';

export interface TextAreaProps
  extends Omit<
    PolymorphicProps<'textarea', TextFieldTextAreaProps>,
    'value' | 'onChange'
  > {
  value?: string;
  onChange?: (value: string) => void;
}

const TextArea: Component<TextAreaProps> = (props) => {
  const [_, rest] = splitProps(props, ['value', 'onChange', 'class']);

  return (
    <TextField value={props.value} onChange={props.onChange}>
      <TextField.TextArea
        class={cn(
          'flex w-full resize-none rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm ring-offset-gray-50 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-gray-400 dark:focus-visible:ring-gray-400',
          props.class
        )}
        {...rest}
      />
    </TextField>
  );
};

export default TextArea;
