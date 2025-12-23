import { useCallback, useMemo } from 'react';
import type { FrameItem } from '../api/types';
import { useBasketContext } from '../state/BasketContext';
import { useAuth } from '../state/AuthContext';
import { useAuthModal } from '../state/AuthModalContext';

export const useIsBasketActive = (frameData: FrameItem) => {
  const { user, status } = useAuth();
  const { items, addItem, removeItem, isMutating } = useBasketContext();
  const { open } = useAuthModal();

  const isBasketActive = useMemo(
    () => items.some((item) => item.frame.id === frameData.id),
    [items, frameData.id],
  );

  const handleBasketToggle = useCallback(async () => {
    if (!user) {
      if (status === 'loading' || status === 'idle') {
        return;
      }
      open('login', window.location.pathname);
      return;
    }

    if (isBasketActive) {
      await removeItem(
        frameData.source === 'custom'
          ? { customFrameId: frameData.id }
          : { catalogItemId: frameData.id },
      );
      return;
    }
    await addItem(
      frameData.source === 'custom'
        ? { customFrameId: frameData.id }
        : { catalogItemId: frameData.id },
    );
  }, [addItem, removeItem, frameData.id, frameData.source, isBasketActive, status, user, open]);

  return {
    isBasketActive,
    toggle: handleBasketToggle,
    isMutating,
  } as const;
};
