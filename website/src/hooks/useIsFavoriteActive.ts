import { useCallback, useMemo } from 'react';
import type { FrameItem } from '../api/types';
import { useFavoritesContext } from '../state/FavoritesContext';
import { useAuth } from '../state/AuthContext';
import { useAuthModal } from '../state/AuthModalContext';

export const useIsFavoriteActive = (frameData: FrameItem) => {
  const { user, status } = useAuth();
  const { favorites, add, remove, isMutating } = useFavoritesContext();
  const { open } = useAuthModal();

  const isFavorite = useMemo(
    () => favorites.some((favorite) => favorite.catalogItemId === frameData.id),
    [favorites, frameData.id],
  );

  const handleFavoriteToggle = useCallback(async () => {
    if (!user) {
      if (status === 'loading' || status === 'idle') {
        return;
      }
      open('login', window.location.pathname);
      return;
    }

    if (isFavorite) {
      await remove(frameData.id);
      return;
    }
    await add(frameData.id);
  }, [add, remove, frameData.id, isFavorite, status, user, open]);

  return {
    isFavorite,
    toggle: handleFavoriteToggle,
    isMutating,
  } as const;
};
