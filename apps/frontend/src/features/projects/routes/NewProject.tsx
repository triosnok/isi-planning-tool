import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  SubmitHandler,
  createForm,
  setValue,
  zodForm,
} from '@modular-forms/solid';
import { A, useNavigate } from '@solidjs/router';
import { IconChevronLeft } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';
import { z } from 'zod';
import { useProjectsMutation } from '../api';
import DatePicker from '@/components/temporal/DatePicker';
import dayjs from 'dayjs';
import { useTranslations } from '@/features/i18n';
import BackLink from '@/components/navigation/BackLink';

const ProjectSchema = z.object({
  name: z.string(),
  referenceCode: z.string(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
});

type ProjectForm = z.infer<typeof ProjectSchema>;

const NewProject: Component = () => {
  const { t } = useTranslations();
  const [form, { Form, Field }] = createForm({
    validate: zodForm(ProjectSchema),
  });
  const navigate = useNavigate();
  const { create } = useProjectsMutation();
  const handleSubmit: SubmitHandler<ProjectForm> = async (values) => {
    try {
      await create.mutateAsync(values);
      navigate('/projects');
    } catch (error) {
      // ignored
    }
  };

  return (
    <Form
      class='flex h-full flex-col justify-between p-2'
      id='new-project-form'
      onSubmit={handleSubmit}
    >
      <div>
        <div class='flex flex-col'>
          <BackLink />
        </div>
        <div>
          <h1 class='text-4xl font-bold'>{t('PROJECTS.NEW_PROJECT')}</h1>
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
          <Label for='referenceCode'>
            {t('PROJECTS.FORM.PROJECT_REFERENCE')}
          </Label>
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
        </div>
      </div>

      <Button type='submit'>{t('GENERAL.SAVE')}</Button>
    </Form>
  );
};

export default NewProject;
