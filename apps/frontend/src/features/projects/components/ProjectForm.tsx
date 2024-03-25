import DatePicker from '@/components/temporal/DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/features/i18n';
import { createForm, setValue, zodForm } from '@modular-forms/solid';
import { Component } from 'solid-js';
import { ProjectSchema, ProjectSchemaValues } from '../api';

export type ProjectFormProps = {
  projectId?: string;
  name?: string;
  referenceCode?: string;
  startsAt?: string;
  endsAt?: string;
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
      endsAt: props.endsAt,
    },
  });

  return (
    <Form
      class='mt-1 flex h-full flex-col gap-1'
      id='project-form'
      onSubmit={props.onSubmit}
    >
      <Label for='name'>{t('PROJECTS.FORM.PROJECT_NAME')}</Label>
      <Field name='name'>
        {(field, props) => (
          <Input
            {...props}
            type='text'
            id='name'
            placeholder='Name'
            value={field.value}
          />
        )}
      </Field>

      <Label for='referenceCode'>{t('PROJECTS.FORM.PROJECT_REFERENCE')}</Label>
      <Field name='referenceCode'>
        {(field, props) => (
          <Input
            {...props}
            type='text'
            id='referenceCode'
            placeholder='Project reference'
            value={field.value}
          />
        )}
      </Field>

      <div class='flex justify-between gap-2'>
        <div>
          <Label for='startsAt'>{t('GENERAL.START_DATE')}</Label>
          <Field name='startsAt' type='string'>
            {(field) => (
              <DatePicker
                value={field.value ?? new Date()}
                onChange={(v) =>
                  setValue(form, 'startsAt', v!.toISOString() ?? undefined)
                }
              />
            )}
          </Field>
        </div>
        <div>
          <Label for='endsAt'>{t('GENERAL.END_DATE')}</Label>
          <Field name='endsAt'>
            {(field) => (
              <DatePicker
                value={field.value}
                onChange={(v) =>
                  setValue(form, 'endsAt', v?.toISOString() ?? undefined)
                }
                clearable
              />
            )}
          </Field>
        </div>
      </div>

      <div class='mt-auto'>
        <Button class='w-full' type='submit'>
          {t('GENERAL.SAVE')}
        </Button>
      </div>
    </Form>
  );
};

export default ProjectForm;
