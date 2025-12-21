import { httpClient } from './httpClient';
import type { BasketItem } from './types';

const BASE_URL = '/basket';

export async function fetchBasketItems(): Promise<BasketItem[]> {
  return httpClient.get<BasketItem[]>(`${BASE_URL}/items`);
}

export async function addBasketItem(catalogItemId: string): Promise<BasketItem> {
  return httpClient.post<BasketItem>(`${BASE_URL}/items`, {
    catalogItemId,
  });
}

export async function updateBasketQuantity(
  catalogItemId: string,
  quantity: number,
): Promise<BasketItem> {
  return httpClient.patch<BasketItem>(`${BASE_URL}/items`, {
    catalogItemId,
    quantity,
  });
}

export async function removeBasketItem(catalogItemId: string): Promise<void> {
  await httpClient.delete(`${BASE_URL}/items`, { body: { catalogItemId } });
}

export async function clearBasket(): Promise<void> {
  await httpClient.delete(`${BASE_URL}`);
}
