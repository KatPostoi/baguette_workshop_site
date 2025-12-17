import { httpClient } from './httpClient';
import type { CatalogItem } from './types';

export async function fetchCatalog(): Promise<CatalogItem[]> {
  return httpClient.get<CatalogItem[]>('/catalog');
}

export async function fetchCatalogItem(slug: string): Promise<CatalogItem> {
  return httpClient.get<CatalogItem>(`/catalog/${encodeURIComponent(slug)}`);
}
