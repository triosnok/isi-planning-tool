import { TranslationKey, useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { Component } from 'solid-js';

export interface ErrorLabelProps {
  text?: TranslationKey | (string & {});
  translate?: boolean;
  class?: string;
}

const ErrorLabel: Component<ErrorLabelProps> = (props) => {
  const { t } = useTranslations();

  const text = () => {
    const text = props.text;
    const translate = props.translate;

    if (translate && text) {
      return t(text as any) ?? text;
    }

    return text;
  };

  return (
    <strong
      class={cn(
        'dark:text-error-400 text-error-600 text-sm',
        !props.text && 'hidden',
        props.class
      )}
    >
      {text()}
    </strong>
  );
};

export default ErrorLabel;
