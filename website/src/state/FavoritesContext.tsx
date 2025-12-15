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
import { env } from '../config/env';

type FavoritesContextValue = {
  favorites: FavoriteItem[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  add: (catalogItemId: string) => Promise<void>;
  remove: (catalogItemId: string) => Promise<void>;
  isFavorite: (catalogItemId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
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

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchFavorites(userId);
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
  }, [userId]);

  const runMutation = useCallback(
    async (operation: () => Promise<unknown>) => {
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
    [loadFavorites],
  );

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const contextValue = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isLoading,
      isMutating,
      error,
      refresh: loadFavorites,
      add: (catalogItemId: string) => runMutation(() => addFavorite(userId, catalogItemId)),
      remove: (catalogItemId: string) => runMutation(() => removeFavorite(userId, catalogItemId)),
      isFavorite: (catalogItemId: string) =>
        favorites.some((fav) => fav.catalogItemId === catalogItemId),
    }),
    [favorites, isLoading, isMutating, error, loadFavorites, runMutation, userId],
  );

  return (
    <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>
  );
};

export const useFavoritesContext = (): FavoritesContextValue => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within FavoritesProvider');
  }
  return context;
};
