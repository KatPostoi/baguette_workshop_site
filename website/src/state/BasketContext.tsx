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
import { ApiError } from '../api/httpClient';
import { useAuth } from './AuthContext';

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
  const { user, status, logout } = useAuth();
  const [items, setItems] = useState<BasketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  useEffect(() => {
    abortRef.current = false;
    return () => {
      abortRef.current = true;
    };
  }, []);

  const handleError = useCallback(
    (err: unknown) => {
      console.error(err);
      if (err instanceof ApiError && err.status === 401) {
        logout();
        setError('Сессия истекла. Войдите снова.');
        return;
      }
      const message = err instanceof Error ? err.message : 'Не удалось выполнить запрос.';
      setError(message);
    },
    [logout],
  );

  const loadItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchBasketItems();
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
  }, [user, handleError]);

  const runMutation = useCallback(
    async (operation: () => Promise<unknown>) => {
      if (!user) {
        throw new Error('Требуется авторизация');
      }
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
    [loadItems, user, handleError],
  );

  useEffect(() => {
    loadItems();
  }, [loadItems, status]);

  const contextValue = useMemo<BasketContextValue>(
    () => ({
      items,
      isLoading,
      isMutating,
      error,
      refresh: loadItems,
      addItem: (catalogItemId: string) => runMutation(() => addBasketItem(catalogItemId)),
      updateQuantity: (catalogItemId, quantity) =>
        runMutation(() => updateBasketQuantity(catalogItemId, quantity)),
      removeItem: (catalogItemId) => runMutation(() => removeBasketItem(catalogItemId)),
      clear: () => runMutation(() => clearBasket()),
    }),
    [items, isLoading, isMutating, error, loadItems, runMutation],
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
