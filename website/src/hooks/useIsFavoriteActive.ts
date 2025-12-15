import { useCallback, useMemo } from 'react';
import type { FrameItem } from '../api/types';
import { useFavoritesContext } from '../state/FavoritesContext';

export const useIsFavoriteActive = (frameData: FrameItem) => {
  const { favorites, add, remove, isMutating } = useFavoritesContext();

  const isFavorite = useMemo(
    () => favorites.some((favorite) => favorite.catalogItemId === frameData.id),
    [favorites, frameData.id],
  );

  const handleFavoriteToggle = useCallback(async () => {
    if (isFavorite) {
      await remove(frameData.id);
      return;
    }
    await add(frameData.id);
  }, [add, remove, frameData.id, isFavorite]);

  return {
    isFavorite,
    toggle: handleFavoriteToggle,
    isMutating,
  } as const;
};
