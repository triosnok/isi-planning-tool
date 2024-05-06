import MapRailingLayer from '@/components/map/MapRailingLayer';
import MapVehicleMarker from '@/components/map/MapVehicleMarker';
import BackLink from '@/components/navigation/BackLink';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SwitchButton } from '@/components/ui/switch-button';
import { DateFormat, NumberFormat, useTranslations } from '@/features/i18n';
import {
  useProjectDetailsQuery,
  useProjectRailings,
} from '@/features/projects/api';
import {
  TripIndicator,
  TripIndicatorVariant,
} from '@/features/trips/components/TripIndicator';
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
import dayjs from 'dayjs';
import { Component, Show, createMemo, createSignal } from 'solid-js';
import { useTripDetailsQuery } from '../api';

import Header from '@/components/layout/Header';
import MapFollowVehicleToggle from '@/components/map/MapFollowVehicleToggle';
import MapPopupLayer from '@/components/map/MapPopupLayer';
import MapRoot from '@/components/map/MapRoot';
import MapZoomControls from '@/components/map/MapZoomControls';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  useTripCaptureAction,
  useTripCaptureDetails,
} from '@/features/capture/api';
import TripNoteModule from '../components/TripNoteModule';
import TripSummaryDialog from '../components/TripSummaryDialog';

const Trip: Component = () => {
  const params = useParams();
  const tripDetails = useTripDetailsQuery(() => params.tripId);
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
  const [showTripNoteDialog, setShowTripNoteDialog] = createSignal(false);

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

    if (storage === undefined) return TripIndicatorVariant.UNDETERMINED;
    if (storage >= 0.5) return TripIndicatorVariant.SUCCESS;
    if (storage >= 0.25) return TripIndicatorVariant.WARNING;
    return TripIndicatorVariant.ERROR;
  });

  const gpsIndicator = createMemo(() => {
    const gpsSignal = captureDetails()?.gpsSignal;

    if (gpsSignal === undefined) return TripIndicatorVariant.UNDETERMINED;
    if (gpsSignal >= 0.95) return TripIndicatorVariant.SUCCESS;
    if (gpsSignal >= 0.75) return TripIndicatorVariant.WARNING;
    return TripIndicatorVariant.ERROR;
  });

  const imageIndicator = createMemo(() => {
    const images = captureDetails()?.images;

    if (images === undefined) return TripIndicatorVariant.UNDETERMINED;

    const analysis = captureDetails()?.imageAnalysis;

    switch (analysis?.overall) {
      case 'OK':
        return TripIndicatorVariant.SUCCESS;
      case 'WITHIN_TOLERANCE':
        return TripIndicatorVariant.WARNING;
      case 'OUT_OF_TOLERANCE':
        return TripIndicatorVariant.ERROR;
    }
  });

  const handleCaptureAction = () => {
    const isCapturing = captureDetails()?.activeCapture;
    const action: CaptureAction = isCapturing ? 'PAUSE' : 'RESUME';
    captureAction.mutate(action);
  };

  return (
    <div class='flex h-svh w-svw flex-col'>
      <Header />

      <MapRoot class='relative flex-1'>
        <div class='pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col gap-2 overflow-hidden max-md:flex-col-reverse md:w-1/2 md:p-4 lg:w-2/5 xl:w-1/3'>
          <section class='pointer-events-auto bg-gray-50 p-2 max-md:rounded-t-lg md:rounded-md dark:bg-gray-900'>
            <div class='flex flex-col'>
              <BackLink href='../..' />
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
                    <Show when={dayjs(project.data?.endsAt).isValid()}>
                      {` - ${d(project.data?.endsAt, DateFormat.MONTH_DAY)}`}
                    </Show>
                  </span>
                </div>

                {/* Desktop trip note button */}
                <Button
                  onClick={() => setShowTripNoteModule(!showTripNoteModule())}
                  class={cn(
                    'order-last max-md:hidden md:order-none',
                    showTripNoteModule() &&
                      'bg-success-600 hover:bg-success-600/90'
                  )}
                >
                  <div class='flex items-center gap-2'>
                    <IconMessage />
                  </div>
                </Button>

                {/* Mobile trip note button */}
                <Button
                  onClick={() => setShowTripNoteDialog(true)}
                  class='order-last md:order-none md:hidden'
                >
                  <div class='flex items-center gap-2'>
                    <IconMessage />
                    <span>{t('NOTES.SHOW_NOTES')}</span>
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
                <TripIndicator
                  variant={storageIndicator()}
                  icon={IconDatabase}
                  indicates='Storage left'
                  status={n(
                    captureDetails()?.storageRemaining,
                    NumberFormat.PERCENTAGE
                  )}
                />

                <TripIndicator
                  variant={gpsIndicator()}
                  icon={IconCurrentLocation}
                  indicates='GPS'
                  status={n(
                    captureDetails()?.gpsSignal,
                    NumberFormat.PERCENTAGE
                  )}
                />

                <TripIndicator
                  variant={
                    captureDetails()?.activeCapture
                      ? TripIndicatorVariant.SUCCESS
                      : TripIndicatorVariant.UNDETERMINED
                  }
                  icon={IconVideo}
                  indicates='Capture'
                  status={
                    captureDetails()?.activeCapture ? 'Active' : 'Inactive'
                  }
                />

                <TripIndicator
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

          <Dialog
            open={showTripNoteDialog()}
            onOpenChange={() => {
              setShowTripNoteDialog(false);
              setShowTripNoteModule(false);
            }}
          >
            <DialogContent>
              <TripNoteModule
                tripId={params.tripId}
                showMapNotes={false}
                open={true}
                onOpenChange={() => {
                  setShowTripNoteDialog(false);
                  setShowTripNoteModule(false);
                }}
              />
            </DialogContent>
          </Dialog>

          <Show when={!tripDetails.data?.endedAt}>
            <div class='pointer-events-auto w-full space-y-2 rounded-md bg-gray-50 p-2 max-md:hidden dark:bg-gray-950'>
              <Button onClick={handleCaptureAction} class='w-full'>
                <Show
                  when={!captureDetails()?.activeCapture}
                  fallback={<span>{t('TRIPS.STOP_CAPTURE')}</span>}
                >
                  <span>{t('TRIPS.START_CAPTURE')}</span>
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
            <MapVehicleMarker heading={dt().heading} position={dt().position} />
          )}
        </Show>

        <MapPopupLayer />
        <MapRailingLayer railings={railings.data} />

        <div class='absolute right-2 top-2 flex flex-col gap-2'>
          <MapZoomControls />
          <MapFollowVehicleToggle />
        </div>
      </MapRoot>
    </div>
  );
};

export default Trip;
