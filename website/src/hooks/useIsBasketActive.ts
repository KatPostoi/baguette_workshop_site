import { useCallback, useMemo } from 'react';
import type { FrameItem } from '../api/types';
import { useBasketContext } from '../state/BasketContext';

export const useIsBasketActive = (frameData: FrameItem) => {
  const { items, addItem, removeItem, isMutating } = useBasketContext();

  const isBasketActive = useMemo(
    () => items.some((item) => item.catalogItemId === frameData.id),
    [items, frameData.id],
  );

  const handleBasketToggle = useCallback(async () => {
    if (isBasketActive) {
      await removeItem(frameData.id);
      return;
    }
    await addItem(frameData.id);
  }, [addItem, removeItem, frameData.id, isBasketActive]);

  return {
    isBasketActive,
    toggle: handleBasketToggle,
    isMutating,
  } as const;
};
