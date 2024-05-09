import Dropzone from '@/components/input/Dropzone';
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
import { Component } from 'solid-js';
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

export default UploadCaptureLogsForm;
