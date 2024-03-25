import BackLink from '@/components/navigation/BackLink';
import { useTranslations } from '@/features/i18n';
import { createForm, zodForm } from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import { z } from 'zod';
import { useProjectsMutation } from '../api';
import ProjectForm from '../components/ProjectForm';

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

  const handleSubmit = async (values: ProjectForm) => {
    try {
      await create.mutateAsync(values);
      navigate('/projects');
    } catch (error) {
      // ignored
    }
  };

  return (
    <div class='flex h-full flex-col justify-between p-2'>
      <div class='flex flex-col'>
        <BackLink />
      </div>
      <h1 class='text-4xl font-bold'>{t('PROJECTS.NEW_PROJECT')}</h1>
      <ProjectForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewProject;
