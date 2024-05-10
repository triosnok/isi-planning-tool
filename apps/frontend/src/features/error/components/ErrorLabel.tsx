import { TranslationKey, useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { Component } from 'solid-js';

export interface ErrorLabelProps {
  text?: TranslationKey | (string & {});
  class?: string;
}

const ErrorLabel: Component<ErrorLabelProps> = (props) => {
  const { t } = useTranslations();

  const text = () => {
    const text = props.text;

    return t(text as any) ?? text;
  };

  return (
    <strong
      class={cn(
        'dark:text-error-400 text-error-600 text-sm font-normal',
        !props.text && 'hidden',
        props.class
      )}
    >
      {text()}
    </strong>
  );
};

export default ErrorLabel;
