import { httpClient } from './httpClient';
import type { ServiceItem } from './types';

export async function fetchServices(): Promise<ServiceItem[]> {
  return httpClient.get<ServiceItem[]>('/services');
}

export type AdminServiceInput = {
  id: number;
  type: string;
  title: string;
  price: number;
};

export const adminListServices = async (): Promise<ServiceItem[]> =>
  httpClient.get<ServiceItem[]>('/admin/services');
export const adminCreateService = async (dto: AdminServiceInput) =>
  httpClient.post<ServiceItem>('/admin/services', dto);
export const adminUpdateService = async (
  id: number,
  dto: Omit<AdminServiceInput, 'id'>,
) =>
  httpClient.patch<ServiceItem>(`/admin/services/${id}`, dto);
export const adminDeleteService = async (id: number) =>
  httpClient.delete<{ success: true }>(`/admin/services/${id}`);
