import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { TbFileUpload } from 'solid-icons/tb';
import { Component, Show, createEffect, createSignal } from 'solid-js';
import { z } from 'zod';

const CaptureLogSchema = z.object({
  logIdentifier: z.string().min(1),
  gnssLog: z.instanceof(File),
  topCameraLog: z.instanceof(File),
  leftCameraLog: z.instanceof(File),
  rightCameraLog: z.instanceof(File),
});

type CaptureLogSchemaValues = z.infer<typeof CaptureLogSchema>;

export type UploadCaptureLogsProps = {
  onSubmit: (values: any) => Promise<void>;
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
    console.log(values);
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
      class='flex flex-col gap-4'
      onSubmit={handleSubmit}
    >
      <Field name='logIdentifier'>
        {(field, props) => (
          <div class='flex flex-col gap-1 pt-2'>
            <Label for={field.name}>
              <span class='mb-1 flex'>{t('CAPTURE.LOG_IDENTIFIER')}</span>
              <Input
                {...props}
                id={field.name}
                type='text'
                value={field.value}
              />
            </Label>
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
            </div>
          )}
        </Field>
      </div>

      <Button type='submit' class='mt-auto'>
        Upload Logs
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
        'flex justify-center rounded-md border border-dashed border-gray-400 py-20 transition-all hover:bg-gray-400/20 dark:border-white',
        isDragOver() &&
          'dark:bg-success-300/50 bg-success-100 border-success-300 transition-all'
      )}
    >
      <Show
        when={file()}
        fallback={
          <div class='flex flex-col items-center justify-center'>
            <TbFileUpload class='size-12' />
            {props.title}
          </div>
        }
      >
        {(f) => (
          <div class='flex flex-col items-center justify-center'>
            <TbFileUpload class='size-12' />
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
