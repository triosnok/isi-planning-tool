import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { A, useParams } from '@solidjs/router';
import {
  IconChevronLeft,
  IconCircleCheckFilled,
  IconEdit,
  IconPlus,
} from '@tabler/icons-solidjs';
import dayjs from 'dayjs';
import { Component, For, Show, createSignal } from 'solid-js';
import { useProjectDetailsQuery, useProjectPlansQuery } from '../api';
import PlanCard from '../components/PlanCard';
import { LayoutProps } from '@/lib/utils';

const Project: Component<LayoutProps> = (props) => {
  const params = useParams();
  const project = useProjectDetailsQuery(params.id);
  const plans = useProjectPlansQuery(params.id);
  const [selectedPlans, setSelectedPlans] = createSignal<string[]>([]);

  const handlePlanToggled = (planId: string) => {
    const plans = selectedPlans();

    if (plans.includes(planId)) {
      setSelectedPlans((p) => p.filter((id) => id !== planId));
    } else {
      setSelectedPlans([...plans, planId]);
    }
  };

  return (
    <>
      <div class='p-2'>
        <div class='flex flex-col'>
          <div class='flex'>
            <A
              href='/projects'
              class='flex items-center text-sm text-gray-600 hover:underline'
            >
              <IconChevronLeft size={16} />
              <p class='flex-none'>Back</p>
            </A>
          </div>
        </div>
        <div class='space-y-2'>
          <div class='flex justify-between'>
            <div>
              <h1 class='text-4xl font-bold'>{project.data?.name}</h1>
              <h2>
                {dayjs(project.data?.startsAt).format('MMM D')} -{' '}
                {dayjs(project.data?.endsAt).format('MMM D')}
              </h2>
              <div class='text-success-500 flex items-center gap-1'>
                <IconCircleCheckFilled size={16} />
                <p class='text-sm'>{project.data?.status}</p>
              </div>
            </div>
            <A href=''>
              <Button>
                <IconEdit />
              </Button>
            </A>
          </div>
          <div class='text-center'>
            <Progress class='rounded-lg' value={20} />
            <p>{'2 000 / 10 000 m'}</p>
          </div>
        </div>

        <Accordion multiple={true} defaultValue={['plans']}>
          <AccordionItem value='plans'>
            <AccordionTrigger>Plans</AccordionTrigger>
            <AccordionContent class='flex flex-col space-y-2 p-2'>
              <Show
                when={plans.data !== undefined && plans.data.length > 0}
                fallback={<p>hihi</p>}
              >
                <A
                  href={`/projects/${params.id}/plans/new`}
                  class='text-brand-blue flex w-full items-center justify-end'
                >
                  <IconPlus class='h-4 w-4' />
                  <span>Add plan</span>
                </A>

                <For each={plans.data}>
                  {(plan) => (
                    <PlanCard
                      car={plan.vehicleModel}
                      startsAt={dayjs(plan.startsAt).format('MMM D')}
                      endsAt={dayjs(plan.endsAt).format('MMM D')}
                      length={Number(plan.meters.toFixed(0))}
                      ongoingTripAmount={0}
                      railingAmount={plan.railings}
                      onToggle={() => handlePlanToggled(plan.id)}
                      selected={selectedPlans().includes(plan.id)}
                    />
                  )}
                </For>
              </Show>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='trips'>
            <AccordionTrigger>Trips</AccordionTrigger>
            <AccordionContent class='flex flex-col space-y-2 p-2'></AccordionContent>
          </AccordionItem>
          <AccordionItem value='railings'>
            <AccordionTrigger>Railings</AccordionTrigger>
            <AccordionContent class='flex flex-col space-y-2 p-2'></AccordionContent>
          </AccordionItem>
          <AccordionItem value='deviations'>
            <AccordionTrigger>Deviations</AccordionTrigger>
            <AccordionContent class='flex flex-col space-y-2 p-2'></AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {props.children}
    </>
  );
};

export default Project;
