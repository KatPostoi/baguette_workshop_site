import { httpClient } from './httpClient';
import type { FavoriteItem } from './types';

export const fetchFavorites = (userId: string): Promise<FavoriteItem[]> =>
  httpClient.get<FavoriteItem[]>(`/favorites/${userId}`);

export const addFavorite = (userId: string, catalogItemId: string): Promise<FavoriteItem> =>
  httpClient.post<FavoriteItem>(`/favorites/${userId}`, { catalogItemId });

export const removeFavorite = (userId: string, catalogItemId: string): Promise<void> =>
  httpClient.delete<void>(`/favorites/${userId}`, { body: { catalogItemId } });
