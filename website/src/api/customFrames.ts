import { httpClient } from './httpClient';
import type { CatalogItem } from './types';

export type PriceQuotePayload = {
  materialId: number;
  styleId?: string;
  widthCm: number;
  heightCm: number;
};

export type CreateCustomFramePayload = PriceQuotePayload & {
  title?: string;
  description?: string;
  color?: string;
  previewUrl?: string | null;
};

export const quoteCustomFrame = async (
  payload: PriceQuotePayload,
): Promise<{ price: number }> => {
  return httpClient.post('/custom-frames/quote', payload);
};

export const createCustomFrame = async (
  payload: CreateCustomFramePayload,
): Promise<CatalogItem> => {
  return httpClient.post('/custom-frames', payload);
};

export const fetchMyCustomFrames = async (): Promise<CatalogItem[]> => {
  return httpClient.get('/custom-frames');
};

export const deleteCustomFrame = async (id: string): Promise<void> => {
  return httpClient.delete(`/custom-frames/${encodeURIComponent(id)}`);
};
