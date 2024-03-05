import { Component } from 'solid-js';
import { Progress } from '../../../components/ui/progress';
import {
  IconRoute,
  IconRulerMeasure,
  IconCalendarClock,
  IconCircleCheckFilled,
  IconAlertCircleFilled,
  IconMessage,
} from '@tabler/icons-solidjs';

export interface ProjectCardProps {
  id?: string;
  name?: string;
  referenceCode?: string;
  startsAt?: string;
  endsAt?: string;
  geoCharacteristics?: string;
  coverage?: string;
  status?: string;
  deviationAmount?: number;
  noteAmount?: number;
  progress?: number;
}

const ProjectCard: Component<ProjectCardProps> = ({
  name,
  referenceCode,
  startsAt,
  endsAt,
  geoCharacteristics,
  coverage,
  status,
  deviationAmount,
  noteAmount,
  progress,
}) => {
  return (
    <div class='overflow-hidden rounded-lg border hover:cursor-pointer hover:bg-gray-100'>
      <div class='p-2'>
        <div class='flex justify-between'>
          <div>
            <h3 class='text-base font-semibold'>
              {name} - {referenceCode}
            </h3>
            <div class='flex items-center gap-1'>
              <IconRoute size={20} />
              <p>{geoCharacteristics}</p>
            </div>
            <div class='flex items-center gap-1'>
              <IconRulerMeasure size={20} />
              <p>{coverage}</p>
            </div>
            <div class='flex items-center gap-1'>
              <IconCalendarClock size={20} />
              <p>
                {startsAt} - {endsAt}
              </p>
            </div>
          </div>
          <div class='text-right'>
            <div class='text-success-500 flex flex-row-reverse items-center gap-1'>
              <p>{status}</p>
              <IconCircleCheckFilled size={20} />
            </div>
            <div class='text-warning-500 flex flex-row-reverse items-center gap-1'>
              <p>{deviationAmount} deviations</p>
              <IconAlertCircleFilled size={20} />
            </div>
            <div class='flex flex-row-reverse items-center gap-1'>
              <p>{noteAmount} notes</p>
              <IconMessage size={20} />
            </div>
          </div>
        </div>
      </div>
      <Progress value={progress} />
    </div>
  );
};

export default ProjectCard;
