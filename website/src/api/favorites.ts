import { httpClient } from './httpClient';
import type { FavoriteItem } from './types';

export const fetchFavorites = (): Promise<FavoriteItem[]> =>
  httpClient.get<FavoriteItem[]>('/favorites');

export const addFavorite = (payload: {
  catalogItemId?: string;
  customFrameId?: string;
}): Promise<FavoriteItem> => httpClient.post<FavoriteItem>('/favorites', payload);

export const removeFavorite = (payload: {
  catalogItemId?: string;
  customFrameId?: string;
}): Promise<void> => httpClient.delete<void>('/favorites', payload);
