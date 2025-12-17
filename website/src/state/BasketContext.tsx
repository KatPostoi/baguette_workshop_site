import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  addBasketItem,
  clearBasket,
  fetchBasketItems,
  removeBasketItem,
  updateBasketQuantity,
} from '../api/basket';
import type { BasketItem } from '../api/types';
import { env } from '../config/env';

type BasketContextValue = {
  items: BasketItem[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addItem: (catalogItemId: string) => Promise<void>;
  updateQuantity: (catalogItemId: string, quantity: number) => Promise<void>;
  removeItem: (catalogItemId: string) => Promise<void>;
  clear: () => Promise<void>;
};

const BasketContext = createContext<BasketContextValue | undefined>(undefined);

export const BasketProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);
  const userId = env.demoUserId;

  useEffect(() => {
    abortRef.current = false;
    return () => {
      abortRef.current = true;
    };
  }, []);

  const handleError = (err: unknown) => {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Не удалось выполнить запрос.';
    setError(message);
  };

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchBasketItems(userId);
      if (!abortRef.current) {
        setItems(data);
        setError(null);
      }
    } catch (err) {
      if (!abortRef.current) {
        handleError(err);
      }
    } finally {
      if (!abortRef.current) {
        setIsLoading(false);
      }
    }
  }, [userId]);

  const runMutation = useCallback(
    async (operation: () => Promise<unknown>) => {
      setIsMutating(true);
      try {
        await operation();
        await loadItems();
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        if (!abortRef.current) {
          setIsMutating(false);
        }
      }
    },
    [loadItems],
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const contextValue = useMemo<BasketContextValue>(
    () => ({
      items,
      isLoading,
      isMutating,
      error,
      refresh: loadItems,
      addItem: (catalogItemId: string) => runMutation(() => addBasketItem(userId, catalogItemId)),
      updateQuantity: (catalogItemId, quantity) =>
        runMutation(() => updateBasketQuantity(userId, catalogItemId, quantity)),
      removeItem: (catalogItemId) => runMutation(() => removeBasketItem(userId, catalogItemId)),
      clear: () => runMutation(() => clearBasket(userId)),
    }),
    [items, isLoading, isMutating, error, loadItems, runMutation, userId],
  );

  return <BasketContext.Provider value={contextValue}>{children}</BasketContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBasketContext = (): BasketContextValue => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasketContext must be used within BasketProvider');
  }
  return context;
};
