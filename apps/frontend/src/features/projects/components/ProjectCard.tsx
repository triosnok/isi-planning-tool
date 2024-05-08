import IconProperty from '@/components/IconProperty';
import { Progress } from '@/components/ui/progress';
import { useTranslations } from '@/features/i18n';
import { ProjectStatus } from '@isi-insight/client';
import {
  IconAlertCircleFilled,
  IconCalendarClock,
  IconMessage,
  IconRulerMeasure,
} from '@tabler/icons-solidjs';
import dayjs from 'dayjs';
import { Component, Show } from 'solid-js';
import ProjectStatusIndicator from './ProjectStatusIndicator';

export interface ProjectCardProps {
  name: string;
  referenceCode: string;
  startsAt: string;
  endsAt: string;
  status: ProjectStatus;
  capturedLength: number;
  totalLength: number;
  deviations: number;
  notes: number;
  progress: number;
}

const ProjectCard: Component<ProjectCardProps> = (props) => {
  const { t, n } = useTranslations();

  const durationString = () => {
    if (!dayjs(props.endsAt).isValid()) {
      return props.startsAt;
    }

    return `${props.startsAt} - ${props.endsAt}`;
  };

  return (
    <div class='overflow-hidden truncate rounded-lg border hover:cursor-pointer hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900'>
      <div class='flex justify-between p-2'>
        <div>
          <h3 class='text-base font-semibold'>
            {props.name} - {props.referenceCode}
          </h3>

          <IconProperty
            icon={IconRulerMeasure}
            text={`${n(props.capturedLength)} / ${n(props.totalLength)} m`}
          />

          <IconProperty icon={IconCalendarClock} text={durationString()} />
        </div>

        <div class='flex flex-col'>
          <ProjectStatusIndicator side='right' status={props.status} />

          <Show when={props.deviations !== 0}>
            <div class='text-warning-500 flex flex-row-reverse items-center gap-1'>
              <IconAlertCircleFilled class='size-5' />
              <p>
                {props.deviations} {t('DEVIATIONS.TITLE')?.toLowerCase()}
              </p>
            </div>
          </Show>

          <IconProperty
            show={props.notes !== 0}
            icon={IconMessage}
            side='right'
            text={`${props.notes} ${t('NOTES.TITLE')?.toLowerCase()}`}
          />
        </div>
      </div>

      <Progress value={props.progress} />
    </div>
  );
};

export default ProjectCard;
