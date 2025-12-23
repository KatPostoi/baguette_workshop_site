import { useCallback, useMemo } from 'react';
import type { FrameItem } from '../api/types';
import { useBasketContext } from '../state/BasketContext';

export type BasketViewItem = {
  id: string;
  frame: FrameItem;
  quantity: number;
  subtotal: number;
  catalogItemId?: string;
  customFrameId?: string;
  source: 'default' | 'custom';
};

export const useBasket = () => {
  const {
    items,
    isLoading,
    isMutating,
    error,
    updateQuantity,
    removeItem: removeItemRaw,
    clear,
    refresh,
  } = useBasketContext();

  const viewItems = useMemo<BasketViewItem[]>(
    () =>
      items.map((item) => ({
        id: item.id,
        frame: item.frame,
        quantity: item.quantity,
        subtotal: item.frame.price * item.quantity,
        catalogItemId: item.catalogItemId,
        customFrameId: item.customFrameId,
        source: item.source,
      })),
    [items],
  );

  const incrementItem = useCallback(
    async (itemId: string) => {
      const current = viewItems.find((i) => i.id === itemId);
      const quantity = (current?.quantity ?? 0) + 1;
      const target =
        current?.customFrameId || current?.catalogItemId
          ? {
              itemId,
              catalogItemId: current?.catalogItemId,
              customFrameId: current?.customFrameId,
            }
          : { itemId };
      await updateQuantity(target, quantity);
    },
    [updateQuantity, viewItems],
  );

  const decrementItem = useCallback(
    async (itemId: string) => {
      const current = viewItems.find((i) => i.id === itemId);
      const currentQuantity = current?.quantity ?? 0;
      const target =
        current?.customFrameId || current?.catalogItemId
          ? {
              itemId,
              catalogItemId: current?.catalogItemId,
              customFrameId: current?.customFrameId,
            }
          : { itemId };
      if (currentQuantity <= 1) {
        await removeItemRaw(target);
        return;
      }
      await updateQuantity(target, currentQuantity - 1);
    },
    [removeItemRaw, updateQuantity, viewItems],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      const current = viewItems.find((i) => i.id === itemId);
      const target =
        current?.customFrameId || current?.catalogItemId
          ? {
              itemId,
              catalogItemId: current?.catalogItemId,
              customFrameId: current?.customFrameId,
            }
          : { itemId };
      await removeItemRaw(target);
    },
    [removeItemRaw, viewItems],
  );

  const summary = useMemo(() => {
    const totalItems = viewItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = viewItems.reduce((sum, item) => sum + item.subtotal, 0);
    return { totalItems, totalPrice };
  }, [viewItems]);

  return {
    items: viewItems,
    isLoading,
    isProcessing: isMutating,
    error,
    summary,
    incrementItem,
    decrementItem,
    removeItem,
    clear,
    reload: refresh,
  };
};
