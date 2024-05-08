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
import UpdateProjectPlanDialog from '@/features/projects/components/UpdateProjectPlanDialog';
import TripCard from '@/features/trips/components/TripCard';
import { LayoutProps, cn } from '@/lib/utils';
import { A, useNavigate, useParams } from '@solidjs/router';
import {
  IconEdit,
  IconPlus
} from '@tabler/icons-solidjs';
import { createVirtualizer } from '@tanstack/solid-virtual';
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
import {
  useProjectDetailsQuery,
  useProjectPlansQuery,
  useProjectRailings,
} from '../api';
import PlanCard from '../components/PlanCard';
import ProjectStatusIndicator from '../components/ProjectStatusIndicator';
import RailingCard from '../components/RailingCard';
import { useProjectSearchParams } from '../utils';

const ProjectDetails: Component<LayoutProps> = (props) => {
  const params = useParams();
  const project = useProjectDetailsQuery(params.id);
  const plans = useProjectPlansQuery(params.id);
  const { t, d, n } = useTranslations();
  const searchParams = useProjectSearchParams();
  const [showNewTripDialog, setShowNewTripDialog] = createSignal(false);
  const [editPlanId, setEditPlanId] = createSignal<string>();
  const trips = useTripsDetailsQuery(params.id, searchParams.selectedPlans);
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
              <div class='min-w-0'>
                <h1
                  title={project.data?.name}
                  class='truncate text-4xl font-bold'
                >
                  {project.data?.name}
                </h1>

                <h2>
                  <Show when={project.data} fallback='...'>
                    {(data) => (
                      <>
                        {d(data().startsAt, DateFormat.MONTH_DAY)}
                        <Show when={dayjs(data().endsAt).isValid()}>
                          {` - ${d(data().endsAt, DateFormat.MONTH_DAY)}`}
                        </Show>
                      </>
                    )}
                  </Show>
                </h2>

                <div class='text-success-500 flex items-center gap-1'>
                  <ProjectStatusIndicator status={project.data?.status} />
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
                      car={`${plan.vehicleModel ?? ''} ${plan.registrationNumber ? '(' + plan.registrationNumber + ')' : ''}`}
                      startsAt={d(plan.startsAt, DateFormat.MONTH_DAY)}
                      endsAt={d(plan.endsAt, DateFormat.MONTH_DAY)}
                      length={plan.meters}
                      ongoingTripAmount={plan.activeTrips}
                      railingAmount={plan.railings}
                      onToggle={() => handlePlanToggled(plan.id)}
                      segments={plan.segments}
                      selected={searchParams.selectedPlans().includes(plan.id)}
                      onEdit={() => setEditPlanId(plan.id)}
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
                        startedAt={trip.startedAt}
                        endedAt={trip.endedAt}
                        deviations={trip.deviations}
                        notes={trip.noteCount}
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
            <AccordionContent class='flex flex-col space-y-2 p-2'>
              <RailingList />
            </AccordionContent>
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

        <Show when={editPlanId()}>
          {(id) => (
            <UpdateProjectPlanDialog
              onOpenChange={() => setEditPlanId(undefined)}
              planId={id()}
            />
          )}
        </Show>

        {props.children}
      </div>

      <div class='p-2'>
        <Button
          class='w-full'
          disabled={planId() === undefined}
          onClick={() => setShowNewTripDialog(true)}
        >
          {t('TRIPS.NEW_TRIP')}
        </Button>
      </div>
    </div>
  );
};

const RailingList: Component = () => {
  const params = useParams();
  const searchParams = useProjectSearchParams();
  const navigate = useNavigate();
  const railings = useProjectRailings(
    () => params.id,
    searchParams.selectedPlans,
    searchParams.hideCompleted
  );

  const [root, setRoot] = createSignal<Element | null>(null);

  const virtualizer = createVirtualizer({
    get count() {
      const data = railings.data;
      return data?.length ?? 0;
    },
    gap: 4,
    estimateSize: () => 68, // height of the cards
    getScrollElement: root,
  });

  return (
    <div ref={setRoot} class='relative -mx-2 flex h-64 overflow-y-auto px-2'>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <For each={virtualizer.getVirtualItems()}>
          {(item) => (
            <div
              class='absolute left-0 top-0 w-full pl-2 pr-1'
              style={{
                height: `${item.size}px`,
                transform: `translateY(${item.start}px)`,
              }}
            >
              <Show when={railings.data?.[item.index]}>
                {(rail) => (
                  <RailingCard
                    id={rail().id}
                    length={rail().length}
                    captureGrade={rail().captureGrade}
                    capturedAt={rail().capturedAt ?? undefined}
                    roads={rail().segments}
                    onClick={() =>
                      navigate(`/projects/${params.id}/railings/${rail().id}`)
                    }
                    class='w-full'
                  />
                )}
              </Show>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default ProjectDetails;
