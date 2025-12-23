import { httpClient } from './httpClient';
import type { CatalogItem } from './types';

export async function fetchCatalog(): Promise<CatalogItem[]> {
  return httpClient.get<CatalogItem[]>('/catalog');
}

export async function fetchCatalogItem(slug: string): Promise<CatalogItem> {
  return httpClient.get<CatalogItem>(`/catalog/${encodeURIComponent(slug)}`);
}

export type CatalogUpsertInput = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  color?: string;
  type?: CatalogItem['type'];
  materialId?: number;
  styleId?: string | null;
  widthCm?: number;
  heightCm?: number;
  imageUrl?: string;
  imageAlt?: string;
};

export const adminListCatalog = async (): Promise<CatalogItem[]> => {
  return httpClient.get('/admin/catalog');
};

export const adminGetCatalogItem = async (id: string): Promise<CatalogItem> => {
  return httpClient.get(`/admin/catalog/${id}`);
};

export const adminUpsertCatalogItem = async (payload: CatalogUpsertInput) => {
  const normalizedType =
    payload.type?.toUpperCase() === 'CUSTOM'
      ? 'CUSTOM'
      : 'DEFAULT';
  const body: CatalogUpsertInput = {
    ...payload,
    type: normalizedType as unknown as CatalogItem['type'],
  };

  if (payload.id) {
    return httpClient.patch<CatalogItem>(`/admin/catalog/${payload.id}`, body);
  }
  return httpClient.post<CatalogItem>('/admin/catalog', body);
};

export const adminDeleteCatalogItem = async (id: string) => {
  return httpClient.delete(`/admin/catalog/${id}`);
};
