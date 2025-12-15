import { request } from './httpClient';
import type { FrameItem } from './types';

export const fetchCatalog = (): Promise<FrameItem[]> => request('/catalog');

export const fetchCatalogItem = (slug: string): Promise<FrameItem> =>
  request(`/catalog/${encodeURIComponent(slug)}`);
