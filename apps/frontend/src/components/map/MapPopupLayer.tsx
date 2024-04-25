import { Overlay } from 'ol';
import { Component, Show, createSignal, onMount } from 'solid-js';
import { useMap } from './MapRoot';
import { FeatureLike } from 'ol/Feature';
import { NumberFormat, useTranslations } from '@/features/i18n';
import { IconCamera, IconRulerMeasure, IconX } from '@tabler/icons-solidjs';
import { RoadRailing } from '@isi-insight/client';
import { cn } from '@/lib/utils';
import { Coordinate } from 'ol/coordinate';

const MapPopupLayer: Component = () => {
  const { t, n } = useTranslations();
  const { map } = useMap();
  const [clickedFeature, setClickedFeature] = createSignal<FeatureLike>();
  const [clickedRailing, setClickedRailing] = createSignal<RoadRailing>();
  const [popup, setPopup] = createSignal<Overlay>();

  let popupElement: HTMLDivElement;

  const getCompletionGradeColor = (completionGrade: number) => {
    if (completionGrade === 0 || undefined) return 'text-brand-blue-500';
    else if (completionGrade > 0 && completionGrade < 95)
      return 'text-error-500';
    else if (completionGrade >= 95 && completionGrade <= 120)
      return 'text-success-500';
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
            <p class='font-bold'>{clickedRailing()?.id}</p>
            <p
              class={cn(
                'text-sm',
                getCompletionGradeColor(clickedRailing()?.captureGrade!)
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
          <div class='flex items-center gap-1'>
            <IconRulerMeasure class='size-5' />
            <p class='text-sm text-gray-600 dark:text-gray-400'>
              {n(clickedRailing()?.length, NumberFormat.DECIMAL)} m
            </p>
          </div>

          <div class='flex items-center gap-1'>
            <IconCamera class='size-5' />
            <Show
              when={clickedRailing()?.capturedAt}
              fallback={
                <p class='text-sm text-gray-600 dark:text-gray-400'>
                  {t('RAILINGS.NOT_YET_CAPTURED')}
                </p>
              }
            >
              <p class='text-sm text-gray-600 dark:text-gray-400'>
                {clickedRailing()?.capturedAt}
              </p>
            </Show>
          </div>
        </div>
      </div>

      <div class='z-20 -mt-1 h-1 w-[23px] bg-gray-50 dark:bg-gray-950' />
      <div class='-mt-2.5 h-5 w-5 rotate-45 border-b-2 border-r-2 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950' />
    </div>
  );
};

export default MapPopupLayer;
