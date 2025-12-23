import { httpClient } from './httpClient';
import type { BasketItem } from './types';

const BASE_URL = '/basket';

export type BasketItemTarget = {
  itemId?: string;
  catalogItemId?: string;
  customFrameId?: string;
};

export async function fetchBasketItems(): Promise<BasketItem[]> {
  return httpClient.get<BasketItem[]>(`${BASE_URL}/items`);
}

export async function addBasketItem(
  payload: { catalogItemId?: string; customFrameId?: string },
): Promise<BasketItem> {
  return httpClient.post<BasketItem>(`${BASE_URL}/items`, payload);
}

export async function updateBasketQuantity(
  target: BasketItemTarget & { quantity: number },
): Promise<BasketItem> {
  return httpClient.patch<BasketItem>(`${BASE_URL}/items`, target);
}

export async function removeBasketItem(target: BasketItemTarget): Promise<void> {
  await httpClient.delete(`${BASE_URL}/items`, target);
}

export async function clearBasket(): Promise<void> {
  await httpClient.delete(`${BASE_URL}`);
}
