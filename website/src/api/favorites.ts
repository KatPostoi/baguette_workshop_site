import { request } from './httpClient';
import type { FavoriteItem } from './types';

export const fetchFavorites = (userId: string): Promise<FavoriteItem[]> =>
  request(`/favorites/${userId}`);

export const addFavorite = (userId: string, catalogItemId: string): Promise<FavoriteItem> =>
  request(`/favorites/${userId}`, {
    method: 'POST',
    body: { catalogItemId },
  });

export const removeFavorite = (userId: string, catalogItemId: string): Promise<void> =>
  request(`/favorites/${userId}`, {
    method: 'DELETE',
    body: { catalogItemId },
  });
