import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/features/auth/api';
import TripCard from '@/features/trips/components/TripCard';
import { LayoutProps } from '@/lib/utils';
import { A, useParams } from '@solidjs/router';
import {
  IconChevronLeft,
  IconCircleCheckFilled,
  IconEdit,
  IconPlus,
} from '@tabler/icons-solidjs';
import dayjs from 'dayjs';
import {
  Component,
  For,
  Show,
  Suspense,
  createMemo,
  createSignal,
} from 'solid-js';
import { useTripsDetailsQuery } from '../../trips/api';
import NewTripDialog from '../../trips/components/NewTripDialog';
import { useProjectDetailsQuery, useProjectPlansQuery } from '../api';
import PlanCard from '../components/PlanCard';

const Project: Component<LayoutProps> = (props) => {
  const params = useParams();
  const project = useProjectDetailsQuery(params.id);
  const plans = useProjectPlansQuery(params.id);

  const [selectedPlans, setSelectedPlans] = createSignal<string[]>([]);
  const [showNewTripDialog, setShowNewTripDialog] = createSignal(false);
  const trips = useTripsDetailsQuery(params.id, selectedPlans);
  const profile = useProfile();

  const planId = createMemo(() => {
    return selectedPlans().length === 1 ? selectedPlans()[0] : undefined;
  });

  const handlePlanToggled = (planId: string) => {
    const plans = selectedPlans();

    if (plans.includes(planId)) {
      setSelectedPlans((p) => p.filter((id) => id !== planId));
    } else {
      setSelectedPlans([...plans, planId]);
    }
  };

  return (
    <div class='flex h-full flex-col justify-between'>
      <div>
        <div class='flex flex-col p-2'>
          <div class='flex'>
            <A
              href='/projects'
              class='flex items-center text-sm text-gray-600 hover:underline'
            >
              <IconChevronLeft size={16} />
              <p class='flex-none'>Back</p>
            </A>
          </div>

          <div class='space-y-2 px-2'>
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
        </div>

        <Accordion multiple={true} defaultValue={['plans']}>
          <AccordionItem value='plans'>
            <AccordionTrigger>Plans ({plans.data?.length})</AccordionTrigger>
            <AccordionContent class='flex flex-col space-y-2 p-2'>
              <Show
                when={plans.data !== undefined && plans.data.length > 0}
                fallback={
                  <A
                    href={`/projects/${params.id}/plans/new`}
                    class='group flex flex-col items-center rounded-md border-2 border-dashed p-2 font-medium hover:bg-gray-100'
                  >
                    <IconPlus class='group-hover:text-brand-blue group-hover:bg-brand-blue-50/40 mb-1 h-16 w-16 rounded-full bg-gray-200 text-gray-400 transition-colors' />
                    <span class='group-hover:text-brand-blue text-gray-600 transition-colors'>
                      Add plan
                    </span>
                  </A>
                }
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
            <AccordionTrigger>Trips ({trips.data?.length})</AccordionTrigger>
            <AccordionContent class='flex flex-col space-y-2 p-2'>
              <Suspense fallback={<div class=''>Loading...</div>}>
                <For each={trips.data}>
                  {(trip) => (
                    <A href={`/projects/${params.id}/trip/${trip.id}`}>
                      <TripCard
                        sequenceNumber={trip.sequenceNumber}
                        startedAt={dayjs(trip.startedAt).format('DD/MM/YYYY')}
                        endedAt={dayjs(trip.endedAt).format('DD MMM')}
                        deviations={trip.deviations}
                        notes={trip.noteCount}
                        length={320}
                        car={trip.driver}
                      />
                    </A>
                  )}
                </For>
              </Suspense>
            </AccordionContent>
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

        <NewTripDialog
          open={showNewTripDialog()}
          onOpenChange={setShowNewTripDialog}
          projectId={params.id}
          planId={planId()}
        />

        {props.children}
      </div>

      <div class='p-2'>
        {/* {profile.data?.role === 'DRIVER' && ( */}
        <Button
          class='w-full'
          disabled={planId() === undefined}
          onClick={() => setShowNewTripDialog(true)}
        >
          New trip
        </Button>
        {/* )} */}
      </div>
    </div>
  );
};

export default Project;
