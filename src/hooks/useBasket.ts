import { useCallback, useEffect, useMemo, useState } from "react";
import type { FrameItem } from "../DB/types";
import { BASKET_STORE } from "../DB";

export type BasketViewItem = {
  id: string;
  frame: FrameItem;
  quantity: number;
  subtotal: number;
};

export const useBasket = () => {
  const [items, setItems] = useState<Array<BasketViewItem>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const basketItems = await BASKET_STORE.getDetailedItems();
      setItems(
        basketItems.map((item) => ({
          id: item.frame.id,
          frame: item.frame,
          quantity: item.quantity,
          subtotal: item.frame.price * item.quantity,
        }))
      );
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить корзину");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const runSafely = useCallback(
    async (action: () => Promise<void>) => {
      setIsProcessing(true);
      try {
        await action();
        await loadItems();
      } catch (err) {
        console.error(err);
        setError("Не удалось обновить корзину");
      } finally {
        setIsProcessing(false);
      }
    },
    [loadItems]
  );

  const incrementItem = useCallback(
    async (frameId: string) => {
      await runSafely(() => BASKET_STORE.incrementQuantity(frameId));
    },
    [runSafely]
  );

  const decrementItem = useCallback(
    async (frameId: string) => {
      await runSafely(() => BASKET_STORE.decrementQuantity(frameId));
    },
    [runSafely]
  );

  const removeItem = useCallback(
    async (frameId: string) => {
      await runSafely(() => BASKET_STORE.removeItem(frameId));
    },
    [runSafely]
  );

  const clear = useCallback(async () => {
    await runSafely(() => BASKET_STORE.clear());
  }, [runSafely]);

  const summary = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);
    return { totalItems, totalPrice };
  }, [items]);

  return {
    items,
    isLoading,
    isProcessing,
    error,
    summary,
    incrementItem,
    decrementItem,
    removeItem,
    clear,
    reload: loadItems,
  };
};
