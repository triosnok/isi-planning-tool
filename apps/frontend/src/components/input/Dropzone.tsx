import { cn } from '@/lib/utils';
import { createDropzone } from '@solid-primitives/upload';
import { IconFile, IconUpload } from '@tabler/icons-solidjs';
import { Component, Show, createEffect, createSignal } from 'solid-js';

export interface DropzoneProps {
  title: string;
  name?: string;
  /**
   * This prop does not work with controlled file inputs, but when changing the value to undefined it will clear the dropzone.
   */
  value?: File;
  class?: string;
  onChange?: (file: File) => void;
  children?: any;
}

const Dropzone: Component<DropzoneProps> = (props) => {
  const [file, setFile] = createSignal<File | undefined>(props.value);
  const [isDragOver, setIsDragOver] = createSignal(false);
  const { setRef } = createDropzone({
    onDrop: (files) => {
      setFile(files[0].file);
      setIsDragOver(false);
    },
    onDragOver: () => {
      setIsDragOver(true);
    },
    onDragLeave: () => {
      setIsDragOver(false);
    },
  });

  createEffect(() => {
    const file = props.value;
    setFile(file);
  });

  createEffect(() => {
    const f = file();
    if (f) props.onChange?.(f);
  });

  return (
    <div
      ref={setRef}
      class={cn(
        'flex cursor-pointer justify-center rounded-md border-2 border-dashed border-gray-300 py-6 transition-colors',
        'text-gray-700 hover:bg-gray-100',
        'dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900',
        isDragOver() &&
          'bg-brand-blue-50/50 border-brand-blue-400 dark:bg-brand-blue-950/50 dark:border-brand-blue-400 text-gray-950 dark:text-gray-50',
        props.class
      )}
    >
      <Show
        when={file()}
        fallback={
          <div class='flex flex-col items-center justify-center gap-2'>
            <IconUpload class='size-12' />
            {props.title}
          </div>
        }
      >
        {(f) => (
          <div class='flex flex-col items-center justify-center gap-2'>
            <IconFile class='size-12' />
            {f().name}
          </div>
        )}
      </Show>

      <input
        id={props.name}
        type='file'
        class='hidden'
        onChange={(e) => setFile(e.target.files?.[0])}
      />
    </div>
  );
};

export default Dropzone;
