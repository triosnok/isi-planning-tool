import { useTranslations } from '@/features/i18n';
import { cn } from '@/lib/utils';
import { ProjectStatus } from '@isi-insight/client';
import { IconClock, IconHistory, IconProgress } from '@tabler/icons-solidjs';
import { Component } from 'solid-js';

export interface ProjectStatusIndicatorProps {
  side?: 'left' | 'right';
  status?: ProjectStatus;
}

const ProjectStatusIndicator: Component<ProjectStatusIndicatorProps> = (
  props
) => {
  const { t } = useTranslations();

  const icon = () => {
    switch (props.status) {
      case 'UPCOMING':
        return <IconClock class='size-5' />;
      case 'ONGOING':
        return <IconProgress class='size-5' />;
      case 'PREVIOUS':
        return <IconHistory class='size-5' />;
    }
  };

  const text = () => {
    switch (props.status) {
      case 'UPCOMING':
        return t('PROJECTS.STATUS.UPCOMING');
      case 'ONGOING':
        return t('PROJECTS.STATUS.ONGOING');
      case 'PREVIOUS':
        return t('PROJECTS.STATUS.PREVIOUS');
    }
  };

  return (
    <div
      class={cn(
        'flex flex-row items-center gap-1 truncate text-sm',
        props.status === 'UPCOMING' && 'text-warning-600',
        props.status === 'ONGOING' && 'text-brand-blue-600',
        props.status === 'PREVIOUS' && 'text-gray-500',
        props.side === 'right' && 'flex-row-reverse'
      )}
    >
      {icon()}
      <span>{text()}</span>
    </div>
  );
};

export default ProjectStatusIndicator;
