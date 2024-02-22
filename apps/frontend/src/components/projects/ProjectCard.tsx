import { Component } from 'solid-js';
import { Progress } from '../ui/progress';
import {
  IconRoute,
  IconRulerMeasure,
  IconCalendarClock,
  IconCircleCheckFilled,
  IconAlertCircleFilled,
  IconMessage,
} from '@tabler/icons-solidjs';

export interface ProjectCardProps {
  class?: string;
}

const ProjectCard: Component<ProjectCardProps> = (props) => {
  return (
    <div class='overflow-hidden rounded-lg border hover:cursor-pointer hover:bg-gray-100'>
      <div class='p-2'>
        <div class='flex justify-between'>
          <div>
            <h3 class='text-base font-semibold'>ABC123 - Ålesund Project</h3>
            <div class='flex items-center gap-1'>
              <IconRoute size={20} />
              <p>E39 - E136 - E99 - E2</p>
            </div>
            <div class='flex items-center gap-1'>
              <IconRulerMeasure size={20} />
              <p>5 623 / 8 999 m</p>
            </div>
            <div class='flex items-center gap-1'>
              <IconCalendarClock size={20} />
              <p>31 Jan - 21 Feb</p>
            </div>
          </div>
          <div class='text-right'>
            <div class='text-success-500 flex flex-row-reverse items-center gap-1'>
              <p>Done</p>
              <IconCircleCheckFilled size={20} />
            </div>
            <div class='text-warning-500 flex flex-row-reverse items-center gap-1'>
              <p>5 Deviations</p>
              <IconAlertCircleFilled size={20} />
            </div>
            <div class='flex flex-row-reverse items-center gap-1'>
              <p>19 notes</p>
              <IconMessage size={20} />
            </div>
          </div>
        </div>
      </div>
      <Progress value={22} />
    </div>
  );
};

export default ProjectCard;
