import MapCarLayer from '@/components/map/MapCarLayer';
import MapRailingLayer from '@/components/map/MapRailingLayer';
import BackLink from '@/components/navigation/BackLink';
import { Button } from '@/components/ui/button';
import { Indicator, IndicatorVariant } from '@/components/ui/indicator';
import { Progress } from '@/components/ui/progress';
import { SwitchButton } from '@/components/ui/switch-button';
import { DateFormat, NumberFormat, useTranslations } from '@/features/i18n';
import {
  useProjectDetailsQuery,
  useProjectRailings,
} from '@/features/projects/api';
import { cn } from '@/lib/utils';
import { CaptureAction } from '@isi-insight/client';
import { Collapsible } from '@kobalte/core';
import { useParams } from '@solidjs/router';
import {
  IconChevronUp,
  IconCurrentLocation,
  IconDatabase,
  IconMessage,
  IconPhoto,
  IconVideo,
} from '@tabler/icons-solidjs';
import { Component, Show, createMemo, createSignal } from 'solid-js';
import { useTripDetailsQuery } from '../api';
import TripNoteModule from '../components/TripNoteModule';
import TripSummaryDialog from '../components/TripSummaryDialog';
import { ImageStatus, getImageAnalysis } from '../utils';
import { useTripCaptureAction, useTripCaptureDetails } from '../api/capture';

const Trip: Component = () => {
  const params = useParams();
  const tripDetails = useTripDetailsQuery(params.tripId);
  const { t, d, n } = useTranslations();
  const project = useProjectDetailsQuery(params.projectId);
  const captureDetails = useTripCaptureDetails(params.tripId);
  const captureAction = useTripCaptureAction(params.tripId);
  const [hideCompletedRailings, setHideCompletedRailings] = createSignal(false);

  const railings = useProjectRailings(
    () => params.projectId,
    () => {
      const ids: string[] = [];
      if (tripDetails.data?.projectPlanId)
        ids.push(tripDetails.data.projectPlanId);
      return ids;
    },
    () => hideCompletedRailings()
  );

  const [showSummaryDialog, setShowSummaryDialog] = createSignal(false);
  const [showTripNoteModule, setShowTripNoteModule] = createSignal(false);
  const [showMore, setShowMore] = createSignal(false);

  const progressValue = () => {
    const captureValue = captureDetails()?.metersCaptured ?? 0;
    const projectValue = project.data?.capturedLength ?? 0;

    return captureValue + projectValue;
  };

  const progressPercent = () => {
    const value = progressValue();
    const goal = project.data?.totalLength;

    if (goal === undefined) return 0;

    return (value / goal) * 100;
  };

  const storageIndicator = createMemo(() => {
    const storage = captureDetails()?.storageRemaining;

    if (storage === undefined) return IndicatorVariant.UNDETERMINED;
    if (storage >= 0.5) return IndicatorVariant.SUCCESS;
    if (storage >= 0.25) return IndicatorVariant.WARNING;
    return IndicatorVariant.ERROR;
  });

  const gpsIndicator = createMemo(() => {
    const gpsSignal = captureDetails()?.gpsSignal;

    if (gpsSignal === undefined) return IndicatorVariant.UNDETERMINED;
    if (gpsSignal >= 0.95) return IndicatorVariant.SUCCESS;
    if (gpsSignal >= 0.75) return IndicatorVariant.WARNING;
    return IndicatorVariant.ERROR;
  });

  const imageIndicator = createMemo(() => {
    const images = captureDetails()?.images;

    if (images === undefined) return IndicatorVariant.UNDETERMINED;

    const analysis = getImageAnalysis(captureDetails()?.images ?? {});

    switch (analysis.overall) {
      case ImageStatus.OK:
        return IndicatorVariant.SUCCESS;
      case ImageStatus.WITHIN_TOLERANCE:
        return IndicatorVariant.WARNING;
      case ImageStatus.OUT_OF_TOLERANCE:
        return IndicatorVariant.ERROR;
    }
  });

  const handleCaptureAction = () => {
    const isCapturing = captureDetails()?.activeCapture;
    const action: CaptureAction = isCapturing ? 'PAUSE' : 'RESUME';
    captureAction.mutate(action);
  };

  return (
    <>
      <div class='pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col gap-2 overflow-hidden max-md:flex-col-reverse md:w-1/2 md:p-4 lg:w-2/5 xl:w-1/3'>
        <section class='pointer-events-auto bg-gray-50 p-2 max-md:rounded-t-lg md:rounded-md dark:bg-gray-900'>
          <div class='flex flex-col'>
            <div class='hidden md:flex'>
              <BackLink href='../..' />
            </div>
          </div>
          <div class='space-y-2'>
            <div class='flex flex-col justify-between space-y-2 md:flex-row md:flex-wrap'>
              <div class='order-first md:order-none'>
                <h1 class='text-3xl font-bold'>
                  {project.data?.name} - {t('TRIPS.TRIP')}{' '}
                  {tripDetails.data?.sequenceNumber}
                </h1>
                <span class='text-sm'>
                  {d(project.data?.startsAt, DateFormat.MONTH_DAY)}
                  {' - '}
                  {d(project.data?.endsAt, DateFormat.MONTH_DAY)}
                </span>
              </div>
              <Button
                onClick={() => setShowTripNoteModule(!showTripNoteModule())}
                class={cn(
                  'order-last md:order-none',
                  showTripNoteModule() &&
                    'bg-success-600 hover:bg-success-600/90'
                )}
              >
                <div class='flex items-center gap-2'>
                  <IconMessage />
                  <p class='md:hidden'>{t('NOTES.ADD_NOTE')}</p>
                </div>
              </Button>

              <div class='order-2 w-full text-center md:order-none'>
                <Progress class='rounded-lg' value={progressPercent()} />
                <p>
                  {n(progressValue(), NumberFormat.INTEGER)}
                  {' / '}
                  {n(project.data?.totalLength, NumberFormat.INTEGER)}
                  {' m'}
                </p>
              </div>
            </div>
            <section class='grid grid-cols-2 gap-2 text-sm md:grid-cols-4'>
              <Indicator
                variant={storageIndicator()}
                icon={IconDatabase}
                indicates='Storage left'
                status={n(
                  captureDetails()?.storageRemaining,
                  NumberFormat.PERCENTAGE
                )}
              />

              <Indicator
                variant={gpsIndicator()}
                icon={IconCurrentLocation}
                indicates='GPS'
                status={n(captureDetails()?.gpsSignal, NumberFormat.PERCENTAGE)}
              />

              <Indicator
                variant={
                  captureDetails()?.activeCapture
                    ? IndicatorVariant.SUCCESS
                    : IndicatorVariant.UNDETERMINED
                }
                icon={IconVideo}
                indicates='Capture'
                status={captureDetails()?.activeCapture ? 'Active' : 'Inactive'}
              />

              <Indicator
                variant={imageIndicator()}
                icon={IconPhoto}
                indicates='Images'
                status=''
              />
            </section>

            <Collapsible.Root class='flex flex-col gap-2'>
              <Collapsible.Content class='animate-collapsible-up ui-expanded:animate-collapsible-down overflow-hidden'>
                <div class='flex flex-row items-center gap-2 px-2'>
                  <SwitchButton
                    checked={hideCompletedRailings()}
                    onChange={setHideCompletedRailings}
                  />
                  <p>{t('RAILINGS.HIDE_COMPLETED_RAILINGS')}</p>
                </div>
              </Collapsible.Content>

              <Collapsible.Trigger
                onClick={() => setShowMore((v) => !v)}
                class='group flex flex-row items-center justify-center gap-1 rounded-md bg-gray-100 p-1 dark:bg-gray-800'
              >
                <IconChevronUp class='size-6 transform transition-transform group-data-[closed]:rotate-180' />

                <Show when={showMore()} fallback={t('TRIPS.SHOW_MORE')}>
                  {t('TRIPS.SHOW_LESS')}
                </Show>
              </Collapsible.Trigger>
            </Collapsible.Root>

            <TripSummaryDialog
              tripId={params.tripId}
              open={showSummaryDialog()}
              onOpenChange={setShowSummaryDialog}
              captureDetails={captureDetails()}
            />

            <Show when={!tripDetails.data?.endedAt}>
              <Button
                onClick={() => setShowSummaryDialog(true)}
                variant='destructive'
                class='w-full md:hidden'
              >
                {t('TRIPS.END_TRIP')}
              </Button>
            </Show>
          </div>
        </section>

        <div class='relative flex-1 overflow-hidden max-md:hidden'>
          <Show when={showTripNoteModule()}>
            <TripNoteModule
              tripId={params.tripId}
              open={showTripNoteModule()}
              onOpenChange={setShowTripNoteModule}
            />
          </Show>
        </div>

        <Show when={!tripDetails.data?.endedAt}>
          <div class='pointer-events-auto w-full space-y-2 rounded-md bg-gray-50 p-2 max-md:hidden dark:bg-gray-950'>
            <Button onClick={handleCaptureAction} class='w-full'>
              <Show
                when={!captureDetails()?.activeCapture}
                fallback={<span>Stop capture</span>}
              >
                <span>Start capture</span>
              </Show>
            </Button>

            <Button
              onClick={() => setShowSummaryDialog(true)}
              variant='destructive'
              class='flex w-full'
            >
              {t('TRIPS.END_TRIP')}
            </Button>
          </div>
        </Show>
      </div>

      <Show when={captureDetails()}>
        {(dt) => (
          <MapCarLayer heading={dt().heading} position={dt().position} />
        )}
      </Show>

      <MapRailingLayer railings={railings.data} />
    </>
  );
};

export default Trip;
