import { httpClient } from './httpClient';
import type { FavoriteItem } from './types';

export const fetchFavorites = (): Promise<FavoriteItem[]> =>
  httpClient.get<FavoriteItem[]>('/favorites');

export const addFavorite = (catalogItemId: string): Promise<FavoriteItem> =>
  httpClient.post<FavoriteItem>('/favorites', { catalogItemId });

export const removeFavorite = (catalogItemId: string): Promise<void> =>
  httpClient.delete<void>('/favorites', { body: { catalogItemId } });
