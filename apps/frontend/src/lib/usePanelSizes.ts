import { makePersisted } from '@solid-primitives/storage';
import { createSignal } from 'solid-js';

export interface UsePanelSizesParams {
  storageKey: string;
  count: number;
}

/**
 * Hook for managing persisted panel sizes.
 *
 * @param params params
 *
 * @returns panel sizes and a function to set the sizes
 */
export const usePanelSizes = (params: UsePanelSizesParams) => {
  const [sizes, setSizes] = makePersisted(createSignal<number[]>(), {
    name: params.storageKey,
  });

  const handleSizesChange = (sizes: number[]) => {
    if (sizes.length !== params.count) return;
    setSizes(sizes);
  };

  return [sizes, handleSizesChange] as const;
};
