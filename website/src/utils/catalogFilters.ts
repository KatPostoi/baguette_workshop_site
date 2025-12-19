import type { FrameItem } from '../api/types';

export type CatalogFilters = {
  favoritesOnly: boolean;
  materialId?: number | null;
  styleId?: string | null;
};

export const filterCatalogFrames = (
  frames: FrameItem[],
  filters: CatalogFilters,
  favoriteIds: Set<string>,
): FrameItem[] => {
  return frames.filter((frame) => {
    if (filters.favoritesOnly && !favoriteIds.has(frame.id)) {
      return false;
    }

    if (filters.materialId && frame.material.id !== filters.materialId) {
      return false;
    }

    if (filters.styleId && (frame.style?.id ?? null) !== filters.styleId) {
      return false;
    }

    return true;
  });
};
