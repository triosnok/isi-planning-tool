import { useTranslations } from '@/features/i18n';
import { ProjectStatus } from '@isi-insight/client';
import {
  IconAlertCircleFilled,
  IconCalendarClock,
  IconCircleCheckFilled,
  IconMessage,
  IconRulerMeasure,
} from '@tabler/icons-solidjs';
import { Component, Show } from 'solid-js';
import { Progress } from '@/components/ui/progress';

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
}

const ProjectCard: Component<ProjectCardProps> = (props) => {
  const { t, n } = useTranslations();
  const progress =
    props.totalLength === 0
      ? 0
      : (props.capturedLength / props.totalLength) * 100;

  return (
    <div class='overflow-hidden truncate rounded-lg border hover:cursor-pointer hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900'>
      <div class='flex justify-between p-2'>
        <div>
          <h3 class='text-base font-semibold'>
            {props.name} - {props.referenceCode}
          </h3>
          <div class='flex items-center gap-1'>
            <IconRulerMeasure class='size-5' />
            <p>
              {n(props.capturedLength)} / {n(props.totalLength)} m
            </p>
          </div>
          <div class='flex items-center gap-1'>
            <IconCalendarClock class='size-5' />
            <p>
              {props.startsAt} - {props.endsAt}
            </p>
          </div>
        </div>

        <div>
          <div class='text-success-500 flex flex-row-reverse items-center gap-1'>
            <p>{t(`PROJECTS.STATUS.${props.status}`)}</p>
            <IconCircleCheckFilled class='size-5' />
          </div>

          <Show when={props.deviations !== 0}>
            <div class='text-warning-500 flex flex-row-reverse items-center gap-1'>
              <p>
                {props.deviations} {t('DEVIATIONS.TITLE')?.toLowerCase()}
              </p>
              <IconAlertCircleFilled class='size-5' />
            </div>
          </Show>

          <Show when={props.notes !== 0}>
            <div class='flex flex-row-reverse items-center gap-1'>
              <p>
                {props.notes} {t('NOTES.TITLE')?.toLowerCase()}
              </p>
              <IconMessage class='size-5' />
            </div>
          </Show>
        </div>
      </div>

      <Progress value={progress} />
    </div>
  );
};

export default ProjectCard;
