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
import { addFavorite, fetchFavorites, removeFavorite } from '../api/favorites';
import type { FavoriteItem } from '../api/types';
import { ApiError } from '../api/httpClient';
import { useAuth } from './AuthContext';

type FavoritesContextValue = {
  favorites: FavoriteItem[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  add: (payload: { catalogItemId?: string; customFrameId?: string }) => Promise<void>;
  remove: (payload: { catalogItemId?: string; customFrameId?: string }) => Promise<void>;
  isFavorite: (frameId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user, status, logout } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
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

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchFavorites();
      if (!abortRef.current) {
        setFavorites(data);
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
        await loadFavorites();
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        if (!abortRef.current) {
          setIsMutating(false);
        }
      }
    },
    [loadFavorites, user, handleError],
  );

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites, status]);

  const contextValue = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isLoading,
      isMutating,
      error,
      refresh: loadFavorites,
      add: (payload) => runMutation(() => addFavorite(payload)),
      remove: (payload) => runMutation(() => removeFavorite(payload)),
      isFavorite: (frameId: string) => favorites.some((fav) => fav.frame.id === frameId),
    }),
    [favorites, isLoading, isMutating, error, loadFavorites, runMutation],
  );

  return (
    <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFavoritesContext = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within FavoritesProvider');
  }
  return context;
};
