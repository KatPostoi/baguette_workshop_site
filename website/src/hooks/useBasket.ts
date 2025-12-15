import { useCallback, useMemo } from 'react';
import type { FrameItem } from '../api/types';
import { useBasketContext } from '../state/BasketContext';

export type BasketViewItem = {
  id: string;
  frame: FrameItem;
  quantity: number;
  subtotal: number;
};

export const useBasket = () => {
  const { items, isLoading, isMutating, error, addItem, updateQuantity, removeItem, clear, refresh } =
    useBasketContext();

  const viewItems = useMemo<BasketViewItem[]>(
    () =>
      items.map((item) => ({
        id: item.catalogItemId,
        frame: item.catalogItem,
        quantity: item.quantity,
        subtotal: item.catalogItem.price * item.quantity,
      })),
    [items],
  );

  const incrementItem = useCallback(
    async (catalogItemId: string) => {
      await addItem(catalogItemId);
    },
    [addItem],
  );

  const decrementItem = useCallback(
    async (catalogItemId: string) => {
      const currentQuantity =
        items.find((item) => item.catalogItemId === catalogItemId)?.quantity ?? 0;
      if (currentQuantity <= 1) {
        await removeItem(catalogItemId);
        return;
      }
      await updateQuantity(catalogItemId, currentQuantity - 1);
    },
    [items, removeItem, updateQuantity],
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
