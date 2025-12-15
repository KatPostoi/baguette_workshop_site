import { useMemo } from 'react';
import type { FrameItem } from '../api/types';
import { useFavoritesContext } from '../state/FavoritesContext';

export const useLikedFrames = (): FrameItem[] => {
  const { favorites } = useFavoritesContext();

  return useMemo(() => favorites.map((favorite) => favorite.catalogItem), [favorites]);
};
