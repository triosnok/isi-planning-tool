import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { CaptureLogDetails } from '@isi-insight/client';
import { IconMovie } from '@tabler/icons-solidjs';
import { Component, For, createSignal } from 'solid-js';

export interface CaptureLogSelectProps {
  logs: CaptureLogDetails[];
  value?: CaptureLogDetails;
  onChange?: (value?: CaptureLogDetails) => void;
}

export const CaptureLogSelect: Component<CaptureLogSelectProps> = (props) => {
  const [captureLog, setCaptureLog] = createSignal(props.value);
  const { d, n } = useTranslations();

  const handleChange = (log: CaptureLogDetails) => {
    const current = captureLog();
    let newValue: CaptureLogDetails | undefined = log;

    if (current?.name === log.name) {
      newValue = undefined;
    }

    setCaptureLog(newValue);
    props.onChange?.(newValue);
  };

  return (
    <div class='grid max-h-64 grid-cols-2 gap-2 overflow-y-auto'>
      <For each={props.logs}>
        {(log) => (
          <button
            type='button'
            onClick={() => handleChange(log)}
            class={cn(
              'flex items-center gap-2 rounded-md border p-2 text-sm outline-none',
              'bg-gray-100',
              'dark:border-gray-800 dark:bg-gray-900',
              log.name === captureLog()?.name &&
                'border-brand-blue-500 dark:border-brand-blue-600 bg-brand-blue-50/40 dark:bg-brand-blue-950/60 hover:bg-brand-blue-50/80 dark:hover:bg-brand-blue-950/80'
            )}
          >
            <IconMovie class='size-5 text-gray-500 dark:text-gray-400' />

            <p class='flex flex-col text-left'>
              <span class='font-medium'>{log.name}</span>
              <span class='text-gray-500 dark:text-gray-400'>
                {d(log.updatedAt)}
              </span>
            </p>

            <span class='ml-auto'>{n(log.size / 1000 ** 2)} MB</span>
          </button>
        )}
      </For>
    </div>
  );
};

export default CaptureLogSelect;
