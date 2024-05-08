import DatePicker from '@/components/temporal/DatePicker';
import { Button } from '@/components/ui/button';
import { Callout, CalloutContent, CalloutTitle } from '@/components/ui/callout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ErrorLabel from '@/features/error/components/ErrorLabel';
import { useTranslations } from '@/features/i18n';
import { createForm, setValue, zodForm } from '@modular-forms/solid';
import { Component, Show } from 'solid-js';
import { ProjectSchema, ProjectSchemaValues } from '../api';

export type ProjectFormProps = {
  projectId?: string;
  name?: string;
  referenceCode?: string;
  startsAt?: string;
  endsAt?: string;
  isError?: boolean;
  onSubmit: (values: ProjectSchemaValues) => Promise<void>;
};

const ProjectForm: Component<ProjectFormProps> = (props) => {
  const { t } = useTranslations();
  const [form, { Form, Field }] = createForm({
    validate: zodForm(ProjectSchema),
    initialValues: {
      projectId: props.projectId,
      name: props.name,
      referenceCode: props.referenceCode,
      startsAt: props.startsAt,
      endsAt: props.endsAt ?? undefined,
    },
  });

  return (
    <Form
      class='mt-1 flex h-full flex-col gap-1'
      id='project-form'
      onSubmit={props.onSubmit}
    >
      <Field name='name'>
        {(field, props) => (
          <>
            <Label for={field.name}>{t('PROJECTS.FORM.PROJECT_NAME')}</Label>
            <Input
              {...props}
              type='text'
              id='name'
              placeholder={t('PROJECTS.FORM.PROJECT_NAME')}
              value={field.value}
            />
            <ErrorLabel text={field.error} />
          </>
        )}
      </Field>

      <Field name='referenceCode'>
        {(field, props) => (
          <>
            <Label for={field.name}>
              {t('PROJECTS.FORM.PROJECT_REFERENCE')}
            </Label>
            <Input
              {...props}
              type='text'
              id='referenceCode'
              placeholder={t('PROJECTS.FORM.PROJECT_REFERENCE')}
              value={field.value}
            />
            <ErrorLabel text={field.error} />
          </>
        )}
      </Field>

      <div class='flex justify-between gap-2'>
        <div>
          <Field name='startsAt' type='string'>
            {(field) => (
              <>
                <Label for={field.name}>{t('GENERAL.START_DATE')}</Label>
                <DatePicker
                  value={field.value ?? new Date()}
                  onChange={(v) =>
                    setValue(form, 'startsAt', v!.toISOString() ?? undefined)
                  }
                />
                <ErrorLabel text={field.error} />
              </>
            )}
          </Field>
        </div>
        <div>
          <Field name='endsAt'>
            {(field) => (
              <>
                <Label for={field.name}>{t('GENERAL.END_DATE')}</Label>
                <DatePicker
                  value={field.value}
                  onChange={(v) =>
                    setValue(form, 'endsAt', v?.toISOString() ?? undefined)
                  }
                  clearable
                />
                <ErrorLabel text={field.error} />
              </>
            )}
          </Field>
        </div>
      </div>

      <Show when={props.isError}>
        <Callout class='mt-2' variant={'error'}>
          <CalloutTitle>Error</CalloutTitle>
          <CalloutContent>
            {t('PROJECTS.FORM.FAILED_TO_CREATE_PROJECT')}
          </CalloutContent>
        </Callout>
      </Show>

      <div class='mt-auto'>
        <Button class='w-full' type='submit'>
          {t('GENERAL.SAVE')}
        </Button>
      </div>
    </Form>
  );
};

export default ProjectForm;
