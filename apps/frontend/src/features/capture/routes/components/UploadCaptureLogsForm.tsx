import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ErrorLabel from '@/features/error/components/ErrorLabel';
import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import {
  SubmitHandler,
  createForm,
  reset,
  setValue,
  zodForm,
} from '@modular-forms/solid';
import { createDropzone } from '@solid-primitives/upload';
import { IconFile, IconUpload } from '@tabler/icons-solidjs';
import { Component, Show, createEffect, createSignal } from 'solid-js';
import { CaptureLogSchema, CaptureLogSchemaValues } from '../../api';

export type UploadCaptureLogsProps = {
  isLoading: boolean;
  onSubmit: (values: any) => Promise<void>;
  class?: string;
};

const UploadCaptureLogsForm: Component<UploadCaptureLogsProps> = (props) => {
  const { t } = useTranslations();
  const [form, { Form, Field }] = createForm({
    validate: zodForm(CaptureLogSchema),
    initialValues: {
      logIdentifier: '',
    },
  });
  const emptyFile = new File([], '');

  const handleSubmit: SubmitHandler<CaptureLogSchemaValues> = async (
    values
  ) => {
    await props.onSubmit(values);
    setValue(form, 'gnssLog', emptyFile);
    setValue(form, 'topCameraLog', emptyFile);
    setValue(form, 'leftCameraLog', emptyFile);
    setValue(form, 'rightCameraLog', emptyFile);
    reset(form);
  };

  return (
    <Form
      id='upload-capture-logs-form'
      class={cn('flex flex-1 flex-col gap-4', props.class)}
      onSubmit={handleSubmit}
    >
      <Field name='logIdentifier'>
        {(field, props) => (
          <div class='flex flex-col gap-1 pt-2'>
            <Label
              for={field.name}
              title='Using an existing identifier will overwrite the previous entry'
            >
              <span class='mb-1 flex'>{t('CAPTURE.LOG_IDENTIFIER')}</span>
              <Input
                {...props}
                id={field.name}
                type='text'
                value={field.value}
              />
            </Label>

            <ErrorLabel text={field.error} />
          </div>
        )}
      </Field>

      <Field name='gnssLog' type='File'>
        {(field) => (
          <div class='flex flex-col gap-1'>
            <Label for={field.name}>
              <span class='mb-1 flex'>GNSS Log</span>
              <Dropzone
                name={field.name}
                title='GNSS Log'
                value={field.value}
                onChange={(f) => setValue(form, 'gnssLog', f)}
              />
            </Label>

            <ErrorLabel text={field.error} />
          </div>
        )}
      </Field>

      <Field name='topCameraLog' type='File'>
        {(field) => (
          <div class='flex flex-col gap-1'>
            <Label for={field.name}>
              <span class='mb-1 flex'>{t('CAPTURE.TOP_CAMERA')}</span>
              <Dropzone
                name={field.name}
                title={t('CAPTURE.TOP_CAMERA') || ''}
                value={field.value}
                onChange={(f) => setValue(form, 'topCameraLog', f)}
              />
            </Label>

            <ErrorLabel text={field.error} />
          </div>
        )}
      </Field>

      <div class='flex flex-row justify-between gap-4'>
        <Field name='leftCameraLog' type='File'>
          {(field) => (
            <div class='flex w-[50%] flex-col gap-1'>
              <Label for={field.name}>
                <span class='mb-1 flex'>{t('CAPTURE.LEFT_CAMERA')}</span>
                <Dropzone
                  name={field.name}
                  title={t('CAPTURE.LEFT_CAMERA') || ''}
                  value={field.value}
                  onChange={(f) => setValue(form, 'leftCameraLog', f)}
                />
              </Label>

              <ErrorLabel text={field.error} />
            </div>
          )}
        </Field>

        <Field name='rightCameraLog' type='File'>
          {(field) => (
            <div class='flex w-[50%] flex-col gap-1'>
              <Label for={field.name}>
                <span class='mb-1 flex'>{t('CAPTURE.RIGHT_CAMERA')}</span>

                <Dropzone
                  name={field.name}
                  title={t('CAPTURE.RIGHT_CAMERA') || ''}
                  value={field.value}
                  onChange={(f) => setValue(form, 'rightCameraLog', f)}
                />
              </Label>

              <ErrorLabel text={field.error} />
            </div>
          )}
        </Field>
      </div>

      <Button type='submit' loading={props.isLoading} class='mt-auto'>
        {t('CAPTURE.UPLOAD_LOGS')}
      </Button>
    </Form>
  );
};

interface DropzoneProps {
  title: string;
  name?: string;
  /**
   * This prop does not work with controlled file inputs, but when changing the value to undefined it will clear the dropzone.
   */
  value?: File;
  class?: string;
  onChange?: (file: File) => void;
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

export default UploadCaptureLogsForm;
