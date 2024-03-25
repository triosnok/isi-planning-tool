import BackLink from '@/components/navigation/BackLink';
import { useTranslations } from '@/features/i18n';
import { useNavigate, useParams } from '@solidjs/router';
import { Component, Show } from 'solid-js';
import {
  ProjectSchemaValues,
  useProjectDetailsQuery,
  useProjectsMutation,
} from '../api';
import ProjectForm from '../components/ProjectForm';

const UpdateProject: Component = () => {
  const params = useParams();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const project = useProjectDetailsQuery(params.id);
  const { update } = useProjectsMutation();

  const handleSubmit = async (values: ProjectSchemaValues) => {
    try {
      await update.mutateAsync({ ...values, projectId: params.id });
      navigate(`../`);
    } catch (error) {
      // ignore
    }
  };

  return (
    <div class='flex h-full flex-col justify-between p-2'>
      <div class='flex flex-col'>
        <BackLink />
      </div>
      <h1 class='text-4xl font-bold'>{t('PROJECTS.UPDATE_PROJECT')}</h1>
      <Show when={project.data}>
        <ProjectForm
          projectId={project.data?.id}
          startsAt={project.data?.startsAt}
          endsAt={project.data?.endsAt}
          name={project.data?.name}
          referenceCode={project.data?.referenceCode}
          onSubmit={handleSubmit}
        />
      </Show>
    </div>
  );
};

export default UpdateProject;
