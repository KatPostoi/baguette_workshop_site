import { httpClient } from './httpClient';
import type { ServiceItem } from './types';

export async function fetchServices(): Promise<ServiceItem[]> {
  return httpClient.get<ServiceItem[]>('/services');
}

export async function fetchService(id: number): Promise<ServiceItem> {
  return httpClient.get<ServiceItem>(`/services/${id}`);
}

export const adminListServices = async (): Promise<ServiceItem[]> => httpClient.get('/admin/services');
export const adminCreateService = async (dto: Partial<ServiceItem>) =>
  httpClient.post<ServiceItem>('/admin/services', dto);
export const adminUpdateService = async (id: number, dto: Partial<ServiceItem>) =>
  httpClient.patch<ServiceItem>(`/admin/services/${id}`, dto);
export const adminDeleteService = async (id: number) => httpClient.delete(`/admin/services/${id}`);
