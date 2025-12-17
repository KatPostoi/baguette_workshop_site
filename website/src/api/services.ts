import { httpClient } from './httpClient';
import type { ServiceItem } from './types';

export async function fetchServices(): Promise<ServiceItem[]> {
  return httpClient.get<ServiceItem[]>('/services');
}

export async function fetchService(id: number): Promise<ServiceItem> {
  return httpClient.get<ServiceItem>(`/services/${id}`);
}
