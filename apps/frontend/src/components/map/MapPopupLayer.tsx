import { DateFormat, NumberFormat, useTranslations } from '@/features/i18n';
import { cn, getRailingStatus } from '@/lib/utils';
import { RoadRailing } from '@isi-insight/client';
import { IconCamera, IconRulerMeasure, IconX } from '@tabler/icons-solidjs';
import { Overlay } from 'ol';
import { FeatureLike } from 'ol/Feature';
import { Component, Show, createSignal, onMount } from 'solid-js';
import IconProperty from '../IconProperty';
import { useMap } from './MapRoot';
import { A, useParams } from '@solidjs/router';
import { RailingStatus } from '@/lib/constants';

const MapPopupLayer: Component = () => {
  const { t, n, d } = useTranslations();
  const { map } = useMap();
  const [clickedFeature, setClickedFeature] = createSignal<FeatureLike>();
  const [clickedRailing, setClickedRailing] = createSignal<RoadRailing>();
  const [popup, setPopup] = createSignal<Overlay>();
  const params = useParams();

  let popupElement: HTMLDivElement;

  const railingStatus = () => {
    const rail = clickedRailing();

    if (rail) return getRailingStatus(rail.captureGrade);

    return RailingStatus.TODO;
  };

  const link = () => {
    const projectId = params.id;
    const railingId = clickedRailing()?.id;

    if (projectId && railingId) {
      return `/projects/${projectId}/railings/${railingId}`;
    }

    return undefined;
  };

  onMount(() => {
    setPopup(
      new Overlay({
        element: popupElement,
        positioning: 'bottom-center',
        offset: [0, -10],
      })
    );

    map.addOverlay(popup()!);

    map.on('click', (e) => {
      setClickedFeature(
        map.getFeaturesAtPixel(e.pixel, {
          layerFilter: (l) => l.get('LAYERTYPE') === 'RAILING',
        })[0]
      );
      clickedFeature()
        ? popup()!.setPosition(e.coordinate)
        : popup()!.setPosition(undefined);
      setClickedRailing(clickedFeature()?.get('RAILING'));
    });
  });

  return (
    <div
      ref={popupElement!}
      class='isolate flex flex-col items-center justify-center'
    >
      <div class='z-20 flex min-w-48 flex-col overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-950'>
        <div class='flex justify-between'>
          <div class='flex items-center gap-1'>
            <Show
              when={link()}
              fallback={<p class='font-bold'>{clickedRailing()?.id}</p>}
            >
              {(link) => (
                <A class='font-bold hover:underline' href={link()}>
                  {clickedRailing()?.id}
                </A>
              )}
            </Show>

            <p
              class={cn(
                'text-sm',
                railingStatus() === RailingStatus.TODO && 'text-brand-blue-400',
                railingStatus() === RailingStatus.ERROR && 'text-error-600',
                railingStatus() === RailingStatus.OK && 'text-success-500'
              )}
            >
              {n(clickedRailing()?.captureGrade, NumberFormat.PERCENTAGE)}
            </p>
          </div>
          <button type='button' onClick={() => popup()?.setPosition(undefined)}>
            <IconX class='size-4' />
            <span class='sr-only'>Close</span>
          </button>
        </div>
        <div class='flex flex-col'>
          <hr class='my-0.5 h-0.5 border-0 bg-gray-300 dark:bg-gray-700' />

          <IconProperty
            icon={IconRulerMeasure}
            text={`${n(clickedRailing()?.length)} m`}
          />

          <IconProperty
            icon={IconCamera}
            text={`${d(clickedRailing()?.capturedAt ?? undefined, DateFormat.DATETIME)}`}
            fallbackText={t('RAILINGS.NOT_YET_CAPTURED')}
          />
        </div>
      </div>

      {/* Arrow */}
      <div class='z-20 -mt-1 h-1 w-[23px] bg-gray-50 dark:bg-gray-950' />
      <div class='-mt-2.5 h-5 w-5 rotate-45 border-b-2 border-r-2 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950' />
    </div>
  );
};

export default MapPopupLayer;
