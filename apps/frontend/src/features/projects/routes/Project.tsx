import BackLink from '@/components/navigation/BackLink';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SeparatorWithText } from '@/components/ui/separator';
import { SwitchButton } from '@/components/ui/switch-button';
import { DateFormat, useTranslations } from '@/features/i18n';
import TripCard from '@/features/trips/components/TripCard';
import { LayoutProps, cn } from '@/lib/utils';
import { A, useParams } from '@solidjs/router';
import {
  IconCircleCheckFilled,
  IconEdit,
  IconPlus,
} from '@tabler/icons-solidjs';
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
import { useProjectSearchParams } from '../utils';

const Project: Component<LayoutProps> = (props) => {
  const params = useParams();
  const project = useProjectDetailsQuery(params.id);
  const plans = useProjectPlansQuery(params.id);
  const { t, d, n } = useTranslations();
  const searchParams = useProjectSearchParams();
  const [showNewTripDialog, setShowNewTripDialog] = createSignal(false);
  const trips = useTripsDetailsQuery(params.id, searchParams.selectedPlans);
  const [hideCompletedRailings, setHideCompletedRailings] = createSignal(false);

  const planId = createMemo(() => {
    return searchParams.selectedPlans().length === 1
      ? searchParams.selectedPlans()[0]
      : undefined;
  });

  const handlePlanToggled = (planId: string) => {
    const plans = searchParams.selectedPlans();

    if (plans.includes(planId)) {
      searchParams.setSelectedPlans(plans.filter((id) => id !== planId));
    } else {
      searchParams.setSelectedPlans([...plans, planId]);
    }
  };

  return (
    <div class='flex h-full flex-col justify-between overflow-hidden'>
      <div class='flex flex-1 flex-col overflow-hidden'>
        <div class='flex flex-col p-2'>
          <div class='flex'>
            <BackLink />
          </div>

          <div class='space-y-2 px-2'>
            <div class='flex justify-between'>
              <div>
                <h1 class='text-4xl font-bold'>{project.data?.name}</h1>

                <h2>
                  <Show when={project.data} fallback='...'>
                    {(data) => (
                      <>
                        {d(data().startsAt, DateFormat.MONTH_DAY)} -{' '}
                        {d(data().endsAt, DateFormat.MONTH_DAY)}
                      </>
                    )}
                  </Show>
                </h2>

                <div class='text-success-500 flex items-center gap-1'>
                  <IconCircleCheckFilled size={16} />
                  <p class='text-sm'>{project.data?.status}</p>
                </div>
              </div>
              <A href={`/projects/${project.data?.id}/update`}>
                <Button>
                  <IconEdit />
                </Button>
              </A>
            </div>
            <div class='text-center'>
              <Progress class='rounded-lg' value={project.data?.progress} />
              <p>
                {n(project.data?.capturedLength ?? 0)} /{' '}
                {n(project.data?.totalLength ?? 0)} m
              </p>
            </div>

            <SeparatorWithText position='LEFT' text='FILTERS' />

            <div class='flex items-center gap-2 py-1'>
              <SwitchButton
                checked={searchParams.hideCompleted()}
                onChange={searchParams.setHideCompleted}
              />
              <span class='text-md font-medium'>
                {t('RAILINGS.HIDE_COMPLETED_RAILINGS')}
              </span>
            </div>
          </div>
        </div>

        <Accordion
          multiple={true}
          defaultValue={['plans']}
          class='flex flex-1 flex-col overflow-y-auto'
        >
          <AccordionItem value='plans'>
            <AccordionTrigger>
              {t('PLANS.TITLE')} ({plans.data?.length})
            </AccordionTrigger>
            <AccordionContent class='flex flex-col space-y-2 p-2'>
              <Show
                when={plans.data !== undefined && plans.data.length > 0}
                fallback={
                  <A
                    href={`/projects/${params.id}/plans/new`}
                    class='group flex flex-col items-center rounded-md border-2 border-dashed p-2 font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900'
                  >
                    <IconPlus
                      class={cn(
                        'mb-1 h-16 w-16 rounded-full transition-colors',
                        'group-hover:text-brand-blue group-hover:bg-brand-blue-50/40 bg-gray-200 text-gray-400',
                        'dark:group-hover:text-brand-blue-500 dark:group-hover:bg-brand-blue-950/40 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      )}
                    />
                    <span class='group-hover:text-brand-blue dark:group-hover:text-brand-blue-500 text-gray-600 transition-colors dark:text-gray-400'>
                      {t('PLANS.ADD_PLAN')}
                    </span>
                  </A>
                }
              >
                <A
                  href={`/projects/${params.id}/plans/new`}
                  class='text-brand-blue dark:text-brand-blue-600 flex w-full items-center justify-end'
                >
                  <IconPlus class='h-4 w-4' />
                  <span>{t('PLANS.ADD_PLAN')}</span>
                </A>

                <For each={plans.data}>
                  {(plan) => (
                    <PlanCard
                      car={plan.vehicleModel}
                      startsAt={d(plan.startsAt, DateFormat.MONTH_DAY)}
                      endsAt={d(plan.endsAt, DateFormat.MONTH_DAY)}
                      length={Number(plan.meters.toFixed(0))}
                      ongoingTripAmount={0}
                      railingAmount={plan.railings}
                      onToggle={() => handlePlanToggled(plan.id)}
                      selected={searchParams.selectedPlans().includes(plan.id)}
                    />
                  )}
                </For>
              </Show>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='trips'>
            <AccordionTrigger>
              {t('TRIPS.TITLE')} ({trips.data?.length})
            </AccordionTrigger>
            <AccordionContent class='flex flex-col space-y-2 p-2'>
              <Suspense fallback={<div class=''>{t('FEEDBACK.LOADING')}</div>}>
                <For each={trips.data}>
                  {(trip) => (
                    <A href={`/projects/${params.id}/trip/${trip.id}`}>
                      <TripCard
                        sequenceNumber={trip.sequenceNumber}
                        startedAt={d(trip.startedAt, DateFormat.MONTH_DAY)}
                        endedAt={d(trip.endedAt, DateFormat.MONTH_DAY)}
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
            <AccordionTrigger>{t('RAILINGS.TITLE')}</AccordionTrigger>
            <AccordionContent class='flex flex-col space-y-2 p-2'></AccordionContent>
          </AccordionItem>
          <AccordionItem value='deviations'>
            <AccordionTrigger>{t('DEVIATIONS.TITLE')}</AccordionTrigger>
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
          {t('TRIPS.NEW_TRIP')}
        </Button>
        {/* )} */}
      </div>
    </div>
  );
};

export default Project;
